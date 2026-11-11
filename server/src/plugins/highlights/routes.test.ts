import { afterEach, describe, expect, it } from 'bun:test';
import { fastify } from 'fastify';
import { BehandlingStatus } from '@/plugins/highlights/behandling-status';
import { createMemoryHighlightRepository } from '@/plugins/highlights/repository';
import { registerHighlightRoutes } from '@/plugins/highlights/routes';

const HIGHLIGHT = {
  id: 'h1',
  pageIndex: 0,
  source: 'pdf',
  rects: [{ x: 0.1, y: 0.1, width: 0.5, height: 0.02 }],
  text: 'Tekst',
  createdAt: 1,
};

const B1 = '00000000-0000-4000-8000-000000000001';
const B2 = '00000000-0000-4000-8000-000000000002';
const URL = `/highlights/${B1}/1?format=ARKIV`;
const EVENTS_URL = `/highlights/${B1}/events`;
const Z1 = { 'x-nav-ident': 'Z1' };

const createApp = (repository = createMemoryHighlightRepository(), status = BehandlingStatus.ACTIVE) => {
  const app = fastify();

  registerHighlightRoutes(app, {
    repository,
    getNavIdent: async (req) => {
      const navIdent = req.headers['x-nav-ident'];

      return typeof navIdent === 'string' ? navIdent : null;
    },
    getBehandlingStatus: async () => status,
  });

  return app;
};

const apps: ReturnType<typeof createApp>[] = [];

const getApp = (repository = createMemoryHighlightRepository(), status = BehandlingStatus.ACTIVE) => {
  const app = createApp(repository, status);
  apps.push(app);

  return app;
};

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()));
});

describe('highlight routes', () => {
  it('rejects requests without a validated NAV-ident', async () => {
    const app = getApp();
    const payload = { added: [HIGHLIGHT], removedIds: [] };

    expect((await app.inject({ method: 'GET', url: EVENTS_URL })).statusCode).toBe(401);
    expect((await app.inject({ method: 'POST', url: URL, payload })).statusCode).toBe(401);
  });

  it('rejects documents that are not archived, requests without a variant and invalid behandling IDs', async () => {
    const app = getApp();
    const payload = { added: [HIGHLIGHT], removedIds: [] };
    const post = async (url: string) => (await app.inject({ method: 'POST', url, headers: Z1, payload })).statusCode;

    expect(await post(`/highlights/${B1}/${B2}?format=ARKIV`)).toBe(400);
    expect(await post(`/highlights/${B1}/1`)).toBe(400);
    expect((await app.inject({ method: 'GET', url: '/highlights/1/events', headers: Z1 })).statusCode).toBe(400);
  });

  it('stores highlights per user, behandling and variant', async () => {
    const app = getApp();
    const { port } = await listen(app);

    const saved = await app.inject({
      method: 'POST',
      url: URL,
      headers: Z1,
      payload: { added: [HIGHLIGHT], removedIds: [] },
    });

    expect(saved.json()).toEqual({ added: [HIGHLIGHT], removedIds: [] });
    expect(await readSnapshot(port, 'Z1')).toEqual([{ id: `${B1}/1`, format: 'ARKIV', highlights: [HIGHLIGHT] }]);
    expect(await readSnapshot(port, 'Z2')).toEqual([]);
    expect(await readSnapshot(port, 'Z1', B2)).toEqual([]);
  });

  it('deletes highlights that a new highlight covers, and never adds them again', async () => {
    const app = getApp();
    const { port } = await listen(app);
    const covering = { ...HIGHLIGHT, id: 'h2', rects: [{ x: 0.05, y: 0.09, width: 0.6, height: 0.04 }] };

    await app.inject({ method: 'POST', url: URL, headers: Z1, payload: { added: [HIGHLIGHT], removedIds: [] } });
    const saved = await app.inject({
      method: 'POST',
      url: URL,
      headers: Z1,
      payload: { added: [covering], removedIds: [] },
    });
    const retried = await app.inject({
      method: 'POST',
      url: URL,
      headers: Z1,
      payload: { added: [HIGHLIGHT], removedIds: [] },
    });

    expect(saved.json()).toEqual({ added: [covering], removedIds: ['h1'] });
    // Rejected additions are reported as removed, so the retrying viewer drops them.
    expect(retried.json()).toEqual({ added: [], removedIds: ['h1'] });
    expect(await readSnapshot(port, 'Z1')).toEqual([{ id: `${B1}/1`, format: 'ARKIV', highlights: [covering] }]);
  });

  it('accepts any number of changes within the body limit, and rejects larger bodies with 413', async () => {
    const app = getApp();
    const added = Array.from({ length: 201 }, (_, i) => ({
      ...HIGHLIGHT,
      id: `h${i.toString(10)}`,
      rects: [{ x: 0.1, y: i * 0.004, width: 0.5, height: 0.002 }],
    }));
    const removedIds = Array.from({ length: 2_001 }, (_, i) => `r${i.toString(10)}`);

    const addedResponse = await app.inject({
      method: 'POST',
      url: URL,
      headers: Z1,
      payload: { added, removedIds: [] },
    });
    const removedResponse = await app.inject({
      method: 'POST',
      url: URL,
      headers: Z1,
      payload: { added: [], removedIds },
    });
    const tooLarge = await app.inject({
      method: 'POST',
      url: URL,
      headers: Z1,
      payload: { added: [{ ...HIGHLIGHT, text: 'x'.repeat(3 * 1024 * 1024) }], removedIds: [] },
    });

    expect(addedResponse.statusCode).toBe(200);
    expect(addedResponse.json().added).toHaveLength(201);
    expect(removedResponse.statusCode).toBe(200);
    expect(tooLarge.statusCode).toBe(413);
  });

  it('deletes highlights, closes every stream and rejects saves when the behandling is finished', async () => {
    const repository = createMemoryHighlightRepository();
    const app = getApp(repository);
    const payload = { added: [HIGHLIGHT], removedIds: [] };
    const { port } = await listen(app);

    await app.inject({ method: 'POST', url: URL, headers: Z1, payload });
    // Z2 has no highlights, and must be told too.
    const events = readEvents(await connect(port, 'Z2'), ALL_EVENTS);
    await repository.deleteBehandling(B1);

    expect(await events).toEqual([
      { name: 'snapshot', data: { documents: [], traceparent: null } },
      { name: 'closed', data: { traceparent: null } },
    ]);
    expect(await readEvents(await connect(port, 'Z1'), ALL_EVENTS)).toEqual([
      { name: 'closed', data: { traceparent: null } },
    ]);
    expect((await app.inject({ method: 'POST', url: URL, headers: Z1, payload })).statusCode).toBe(409);
  });

  it('closes the stream and rejects saves when the behandling was finished before it was marked', async () => {
    const app = getApp(createMemoryHighlightRepository(), BehandlingStatus.FINISHED);
    const { port } = await listen(app);
    const payload = { added: [HIGHLIGHT], removedIds: [] };

    expect(await readEvents(await connect(port, 'Z1'), ALL_EVENTS)).toEqual([
      { name: 'closed', data: { traceparent: null } },
    ]);
    expect((await app.inject({ method: 'POST', url: URL, headers: Z1, payload })).statusCode).toBe(409);
  });

  it('closes the stream without marking the behandling as finished when the user has no access', async () => {
    const app = getApp(createMemoryHighlightRepository(), BehandlingStatus.FORBIDDEN);
    const { port } = await listen(app);
    const payload = { added: [HIGHLIGHT], removedIds: [] };

    expect(await readEvents(await connect(port, 'Z1'), ALL_EVENTS)).toEqual([
      { name: 'closed', data: { traceparent: null } },
    ]);
    expect((await app.inject({ method: 'POST', url: URL, headers: Z1, payload })).statusCode).toBe(200);
  });

  it('ends the stream without events when the behandling status is unknown, so the client reconnects', async () => {
    const app = getApp(createMemoryHighlightRepository(), BehandlingStatus.UNKNOWN);
    const { port } = await listen(app);
    const response = await connect(port, 'Z1');

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('retry: 10000\n\n');
  });

  it("sends the snapshot first, then the user's own changes in the behandling", async () => {
    const app = getApp();
    const { port } = await listen(app);
    const covering = { ...HIGHLIGHT, id: 'h2', rects: [{ x: 0.05, y: 0.09, width: 0.6, height: 0.04 }] };
    await app.inject({ method: 'POST', url: URL, headers: Z1, payload: { added: [HIGHLIGHT], removedIds: [] } });

    const events = readEvents(await connect(port, 'Z1'), 3);
    const otherBehandling = `/highlights/${B2}/2?format=ARKIV`;
    await app.inject({
      method: 'POST',
      url: URL,
      headers: { 'x-nav-ident': 'Z2' },
      payload: { added: [HIGHLIGHT], removedIds: [] },
    });
    await app.inject({
      method: 'POST',
      url: otherBehandling,
      headers: Z1,
      payload: { added: [HIGHLIGHT], removedIds: [] },
    });
    await app.inject({ method: 'POST', url: URL, headers: Z1, payload: { added: [covering], removedIds: [] } });

    expect(await events).toEqual([
      {
        name: 'snapshot',
        data: { documents: [{ id: `${B1}/1`, format: 'ARKIV', highlights: [HIGHLIGHT] }], traceparent: null },
      },
      { name: 'added', data: { id: `${B1}/1`, format: 'ARKIV', highlights: [covering], traceparent: null } },
      { name: 'removed', data: { id: `${B1}/1`, format: 'ARKIV', highlightIds: ['h1'], traceparent: null } },
    ]);
  });
});

/** Reads until the stream ends. */
const ALL_EVENTS = Number.POSITIVE_INFINITY;

const connect = (port: number, navIdent: string, behandlingId = B1): Promise<Response> =>
  fetch(`http://localhost:${port.toString(10)}/highlights/${behandlingId}/events`, {
    headers: { 'x-nav-ident': navIdent },
  });

const readSnapshot = async (port: number, navIdent: string, behandlingId = B1): Promise<unknown> => {
  const [event] = await readEvents(await connect(port, navIdent, behandlingId), 1);

  return isRecord(event?.data) ? event.data.documents : undefined;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const listen = async (app: ReturnType<typeof createApp>): Promise<{ port: number }> => {
  await app.listen({ port: 0 });
  const address = app.server.address();

  if (address === null || typeof address === 'string') {
    throw new Error('Expected a port');
  }

  return { port: address.port };
};

interface ParsedEvent {
  name: string;
  data: unknown;
}

const readEvents = async (response: Response, count: number): Promise<ParsedEvent[]> => {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  const read = async (text: string): Promise<string> => {
    if (text.split('\n\n').length > count) {
      return text;
    }

    const chunk = await reader?.read();

    return chunk === undefined || chunk.done ? text : read(text + decoder.decode(chunk.value));
  };

  const text = await read('');
  await reader?.cancel();

  return text
    .split('\n\n')
    .filter((block) => block.length > 0)
    .map(parseEvent);
};

const parseEvent = (block: string): ParsedEvent => {
  const lines = block.split('\n');
  const name = lines.find((line) => line.startsWith('event: '))?.slice('event: '.length) ?? '';
  const data = lines.find((line) => line.startsWith('data: '))?.slice('data: '.length) ?? 'null';

  return { name, data: JSON.parse(data) };
};
