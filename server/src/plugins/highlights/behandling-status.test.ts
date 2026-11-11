import { afterEach, describe, expect, it, mock, spyOn } from 'bun:test';
import Fastify from 'fastify';
import { BehandlingStatus, getBehandlingStatus } from '@/plugins/highlights/behandling-status';

afterEach(() => {
  mock.restore();
});

describe('getBehandlingStatus', () => {
  it('asks Kabal API for JSON, even when the browser accepts only an event stream', async () => {
    const fetchSpy = spyOn(globalThis, 'fetch').mockResolvedValue(Response.json({ active: true }));

    expect(await getStatus()).toBe(BehandlingStatus.ACTIVE);
    expect(new Headers(fetchSpy.mock.calls[0]?.[1]?.headers).get('accept')).toBe('application/json');
  });

  it('is forbidden when Kabal API responds with 403', async () => {
    spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 403 }));

    expect(await getStatus()).toBe(BehandlingStatus.FORBIDDEN);
  });
});

const getStatus = async (): Promise<BehandlingStatus | undefined> => {
  const app = Fastify();
  const statuses: BehandlingStatus[] = [];

  app.decorateRequest('client_version', '');
  app.decorateRequest('tab_id', '');
  app.decorateRequest('getOboAccessToken', async () => 'obo-token');
  app.get('/', async (req) => {
    statuses.push(await getBehandlingStatus(req, 'behandling-id'));

    return null;
  });

  await app.inject({ method: 'GET', url: '/', headers: { accept: 'text/event-stream' } });
  await app.close();

  return statuses[0];
};
