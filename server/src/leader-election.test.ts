import { describe, expect, it, mock } from 'bun:test';
import { createGetLeadership, Leadership } from '@/leader-election';
import type { Logger } from '@/logger';

/** A fake elector sidecar. Use with `using`, so it stops even when the test fails. */
const serve = (respond: () => Response | Promise<Response>) => Bun.serve({ port: 0, fetch: respond });

const getLeader = (name: string) => () => Response.json({ name, last_update: '2026-11-19T14:00:00Z' });

const createLogger = () => ({
  debug: mock<Logger['debug']>(),
  info: mock<Logger['info']>(),
  warn: mock<Logger['warn']>(),
  error: mock<Logger['error']>(),
});

const unavailable = () => new Response('Unavailable', { status: 503 });

describe('leader election', () => {
  const signal = new AbortController().signal;

  it('is the leader without an elector', async () => {
    expect(await createGetLeadership(undefined, 'pod-a')(signal)).toBe(Leadership.LEADER);
  });

  it('is the leader when the elector names this pod', async () => {
    using elector = serve(getLeader('pod-a'));

    expect(await createGetLeadership(elector.url.href, 'pod-a')(signal)).toBe(Leadership.LEADER);
  });

  it('is not the leader when the elector names another pod', async () => {
    using elector = serve(getLeader('pod-b'));

    expect(await createGetLeadership(elector.url.href, 'pod-a')(signal)).toBe(Leadership.FOLLOWER);
  });

  it('rejects when the elector fails, and warns once per run of failures', async () => {
    const logger = createLogger();
    const respond = mock(unavailable)
      .mockImplementationOnce(unavailable)
      .mockImplementationOnce(() => Response.json({ leader: 'pod-a' }))
      .mockImplementationOnce(getLeader('pod-a'));
    using elector = serve(respond);
    const getLeadership = createGetLeadership(elector.url.href, 'pod-a', logger);

    await expect(getLeadership(signal)).rejects.toThrow();
    await expect(getLeadership(signal)).rejects.toThrow();
    expect(logger.warn).toHaveBeenCalledTimes(1);

    expect(await getLeadership(signal)).toBe(Leadership.LEADER);
    expect(logger.info).toHaveBeenCalledWith({ msg: 'Leader election recovered' });

    await expect(getLeadership(signal)).rejects.toThrow();
    expect(logger.warn).toHaveBeenCalledTimes(2);
  });

  it('logs when this pod becomes or stops being the leader', async () => {
    const logger = createLogger();
    const respond = mock(getLeader('pod-b'));
    using elector = serve(respond);
    const getLeadership = createGetLeadership(elector.url.href, 'pod-a', logger);

    await getLeadership(signal);
    await getLeadership(signal);
    respond.mockImplementation(getLeader('pod-a'));
    await getLeadership(signal);
    await getLeadership(signal);

    expect(logger.info.mock.calls).toEqual([
      [{ msg: 'This pod is not the leader, pod-b is' }],
      [{ msg: 'This pod is the leader' }],
    ]);
  });

  it('rejects without warning when aborted', async () => {
    const logger = createLogger();
    // Like an elector that never answers.
    using elector = serve(() => new Promise<Response>(() => undefined));
    const controller = new AbortController();
    const result = createGetLeadership(elector.url.href, 'pod-a', logger)(controller.signal);

    controller.abort();

    await expect(result).rejects.toThrow();
    expect(logger.warn).not.toHaveBeenCalled();
  });
});
