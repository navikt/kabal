import { afterAll, beforeAll, describe, expect, it } from 'bun:test';
import { randomUUID } from 'node:crypto';
import { setTimeout } from 'node:timers/promises';
import type { MarkerHighlight } from '@navikt/klage-file-viewer/highlights';
import { optionalEnvString } from '@/config/env-var';
import {
  BehandlingFinishedError,
  createValkeyHighlightRepository,
  type HighlightRepository,
  type HighlightServerEvent,
} from '@/plugins/highlights/repository';
import type { HighlightBehandling, HighlightDocument } from '@/plugins/highlights/types';
import { createValkeyClient, type ValkeyClientType } from '@/valkey/valkey-client';

/** Set to run against real Valkey, e.g. `VALKEY_TEST_URL=redis://localhost:6379 bun test repository.valkey`. */
const url = optionalEnvString('VALKEY_TEST_URL');

/** Each ID gets its own line, so highlights never cover each other. */
const getHighlight = (id: string): MarkerHighlight => ({
  id,
  pageIndex: 0,
  source: 'pdf',
  rects: [{ x: 0.1, y: Number.parseInt(id.slice(1), 10) / 10, width: 0.5, height: 0.02 }],
  text: 'Tekst',
  createdAt: 1,
});

const getDocument = (): HighlightDocument => ({
  behandlingId: randomUUID(),
  documentId: '1',
  format: 'ARKIV',
  navIdent: `Z${randomUUID()}`,
});

describe.skipIf(url === undefined)('Valkey highlight repository', () => {
  const options = { url: url ?? '' };
  const repositories: HighlightRepository[] = [];
  const raw: ValkeyClientType = createValkeyClient(options);

  /** Each repository is a pod. */
  const createPod = () => {
    const repository = createValkeyHighlightRepository(options);
    repositories.push(repository);

    return repository;
  };

  beforeAll(async () => {
    await raw.connect();
  });

  afterAll(async () => {
    await Promise.all(repositories.map((repository) => repository.close()));
    raw.destroy();
  });

  it('sends highlights saved on another pod in the snapshot, and keeps removed IDs removed', async () => {
    const [a, b] = [createPod(), createPod()];
    const document = getDocument();

    expect(await a.save(document, { added: [getHighlight('h1'), getHighlight('h2')], removedIds: [] })).toEqual({
      added: [getHighlight('h1'), getHighlight('h2')],
      removedIds: [],
    });
    await a.save(document, { added: [], removedIds: ['h1'] });

    expect(await b.save(document, { added: [getHighlight('h1')], removedIds: [] })).toEqual({
      added: [],
      removedIds: ['h1'],
    });
    expect(await readFirstEvent(b, document)).toEqual({
      name: 'snapshot',
      data: {
        documents: [{ id: `${document.behandlingId}/1`, format: 'ARKIV', highlights: [getHighlight('h2')] }],
        traceparent: null,
      },
    });
  });

  it('applies concurrent saves from several pods', async () => {
    const [a, b] = [createPod(), createPod()];
    const document = getDocument();
    const ids = ['h1', 'h2', 'h3', 'h4'];

    await Promise.all(
      ids.map((id, index) => (index % 2 === 0 ? a : b).save(document, { added: [getHighlight(id)], removedIds: [] })),
    );

    const { data } = await readFirstEvent(a, document);

    expect(getHighlightIds(data).toSorted()).toEqual(ids);
  });

  it("sends the snapshot, then the user's changes saved on another pod, but not saves without changes", async () => {
    const [a, b] = [createPod(), createPod()];
    const document = getDocument();
    const otherUser = { ...document, navIdent: `Z${randomUUID()}` };
    const { events, unsubscribe } = subscribe(b, document);

    await waitFor(() => events.length === 1);
    await a.save(otherUser, { added: [getHighlight('h1')], removedIds: [] });
    await a.save(document, { added: [getHighlight('h1')], removedIds: [] });
    await a.save(document, { added: [getHighlight('h1')], removedIds: [] });
    await a.save(document, { added: [], removedIds: ['h1'] });
    await waitFor(() => events.length === 3);
    await setTimeout(100);
    unsubscribe();

    expect(events.map(({ name }) => name)).toEqual(['snapshot', 'added', 'removed']);
    expect(JSON.parse(events[1]?.data ?? '')).toMatchObject({
      id: `${document.behandlingId}/1`,
      format: 'ARKIV',
      highlights: [getHighlight('h1')],
    });
    expect(JSON.parse(events[2]?.data ?? '')).toMatchObject({ highlightIds: ['h1'] });
  });

  it('stops sending events when unsubscribed', async () => {
    const pod = createPod();
    const document = getDocument();
    const { events, unsubscribe } = subscribe(pod, document);

    await waitFor(() => events.length === 1);
    unsubscribe();
    await pod.save(document, { added: [getHighlight('h1')], removedIds: [] });
    await setTimeout(100);

    expect(events.map(({ name }) => name)).toEqual(['snapshot']);
  });

  it('keeps sending events to other viewers of the behandling on the pod when one unsubscribes', async () => {
    const [a, b] = [createPod(), createPod()];
    const document = getDocument();
    const first = subscribe(b, document);
    const second = subscribe(b, document);

    await waitFor(() => first.events.length === 1 && second.events.length === 1);
    first.unsubscribe();
    await a.save(document, { added: [getHighlight('h1')], removedIds: [] });
    await waitFor(() => second.events.length === 2);
    second.unsubscribe();

    expect(first.events.map(({ name }) => name)).toEqual(['snapshot']);
    expect(second.events.map(({ name }) => name)).toEqual(['snapshot', 'added']);
  });

  it('does not stay subscribed when unsubscribed before the subscription is active', async () => {
    const pod = createPod();
    const document = getDocument();
    const channel = getChannel(document.behandlingId);
    const { events, unsubscribe } = subscribe(pod, document);

    unsubscribe();
    await waitFor(async () => (await raw.pubSubNumSub(channel))[channel] === 0);

    expect(events).toEqual([]);
  });

  it('reports a lost subscriber connection, so the client reconnects', async () => {
    const pod = createPod();
    const document = getDocument();
    const errors: unknown[] = [];
    const { events, unsubscribe } = subscribe(pod, document, (error) => errors.push(error));

    await waitFor(() => events.length === 1);
    await raw.clientKill({ filter: 'ID', id: await getSubscriberClientId(raw) });
    await waitFor(() => errors.length === 1);
    unsubscribe();
  });

  it('closes the behandling for every user, rejects later saves, and deletes the highlights', async () => {
    const [a, b] = [createPod(), createPod()];
    const saver = getDocument();
    const viewer = { ...saver, navIdent: `Z${randomUUID()}` };
    const other = { ...saver, behandlingId: randomUUID() };

    await a.save(saver, { added: [getHighlight('h1')], removedIds: [] });
    await a.save(other, { added: [getHighlight('h1')], removedIds: [] });

    const saverEvents = subscribe(b, saver);
    const viewerEvents = subscribe(a, viewer);

    await waitFor(() => saverEvents.events.length === 1 && viewerEvents.events.length === 1);
    await b.deleteBehandling(saver.behandlingId);
    await waitFor(() => saverEvents.events.length === 2 && viewerEvents.events.length === 2);
    await b.deleteBehandling(saver.behandlingId);
    await setTimeout(100);
    saverEvents.unsubscribe();
    viewerEvents.unsubscribe();

    for (const { events } of [saverEvents, viewerEvents]) {
      expect(events.map(({ name }) => name)).toEqual(['snapshot', 'closed']);
    }

    expect(await raw.keys(`highlights*:${saver.behandlingId}`)).toEqual([`highlights-finished:${saver.behandlingId}`]);
    expect(await readFirstEvent(a, saver)).toEqual({ name: 'closed', data: { traceparent: null } });
    expect(a.save(saver, { added: [getHighlight('h2')], removedIds: [] })).rejects.toBeInstanceOf(
      BehandlingFinishedError,
    );
    expect(getHighlightIds((await readFirstEvent(a, other)).data)).toEqual(['h1']);
  });
});

const subscribe = (
  repository: HighlightRepository,
  behandling: HighlightBehandling,
  onError: (error: unknown) => void = (error) => {
    throw error;
  },
) => {
  const events: HighlightServerEvent[] = [];
  const unsubscribe = repository.subscribe(behandling, (event) => events.push(event), onError);

  return { events, unsubscribe };
};

const waitFor = async (condition: () => boolean | Promise<boolean>, timeoutMs = 2_000): Promise<void> => {
  const deadline = Date.now() + timeoutMs;

  while (!(await condition())) {
    if (Date.now() > deadline) {
      throw new Error('Timed out');
    }

    await setTimeout(10);
  }
};

const readFirstEvent = async (
  repository: HighlightRepository,
  behandling: HighlightBehandling,
): Promise<{ name: string; data: unknown }> => {
  const { events, unsubscribe } = subscribe(repository, behandling);

  await waitFor(() => events.length > 0);
  unsubscribe();

  const [event] = events;

  if (event === undefined) {
    throw new Error('No event');
  }

  return { name: event.name, data: JSON.parse(event.data) };
};

/** IDs of the highlights in the snapshot's documents. */
const getHighlightIds = (data: unknown): unknown[] => {
  if (!isRecord(data) || !Array.isArray(data.documents)) {
    return [];
  }

  return data.documents.flatMap((document) =>
    isRecord(document) && Array.isArray(document.highlights)
      ? document.highlights.map((highlight) => (isRecord(highlight) ? highlight.id : undefined))
      : [],
  );
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const getChannel = (behandlingId: string): string => `highlights-events:${behandlingId}`;

/** The pods of earlier tests have unsubscribed, so only the current pod's subscriber last ran `SUBSCRIBE`. */
const getSubscriberClientId = async (client: ValkeyClientType): Promise<number> => {
  const list = await client.clientList();
  const subscriber = list.find(({ cmd }) => cmd === 'subscribe');

  if (subscriber === undefined) {
    throw new Error('No subscriber connection');
  }

  return subscriber.id;
};
