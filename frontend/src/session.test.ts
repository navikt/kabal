import { afterEach, describe, expect, it, mock } from 'bun:test';
import { getSessionStatus, getSessionStatusWithRetry, SessionStatus } from '@/session';

const originalFetch = globalThis.fetch;
const NEVER_ABORTED = new AbortController().signal;

const mockFetch = (impl: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) => {
  globalThis.fetch = mock(impl) as unknown as typeof fetch;
};

describe('getSessionStatus', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should return active for an active session', async () => {
    expect.assertions(1);
    mockFetch(async () => Response.json({ session: { active: true } }));

    expect(await getSessionStatus()).toBe(SessionStatus.ACTIVE);
  });

  it('should return inactive for an inactive session', async () => {
    expect.assertions(1);
    mockFetch(async () => Response.json({ session: { active: false } }));

    expect(await getSessionStatus()).toBe(SessionStatus.INACTIVE);
  });

  it('should return inactive for 401', async () => {
    expect.assertions(1);
    mockFetch(async () => new Response(null, { status: 401 }));

    expect(await getSessionStatus()).toBe(SessionStatus.INACTIVE);
  });

  it('should return unknown for other errors', async () => {
    expect.assertions(1);
    mockFetch(async () => new Response(null, { status: 502 }));

    expect(await getSessionStatus()).toBe(SessionStatus.UNKNOWN);
  });

  it('should return unknown for unexpected response bodies', async () => {
    expect.assertions(1);
    mockFetch(async () => Response.json({}));

    expect(await getSessionStatus()).toBe(SessionStatus.UNKNOWN);
  });

  it('should return unknown for non-boolean active values', async () => {
    expect.assertions(3);

    for (const active of [null, 'true', 1]) {
      mockFetch(async () => Response.json({ session: { active } }));

      expect(await getSessionStatus()).toBe(SessionStatus.UNKNOWN);
    }
  });

  it('should return unknown for network errors', async () => {
    expect.assertions(1);
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));

    expect(await getSessionStatus()).toBe(SessionStatus.UNKNOWN);
  });
});

describe('getSessionStatusWithRetry', () => {
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should retry unknown until the status is known', async () => {
    expect.assertions(2);
    const responses = [
      new Response(null, { status: 502 }),
      new Response(null, { status: 503 }),
      Response.json({ session: { active: true } }),
    ];
    const onRetry = mock(() => undefined);
    mockFetch(async () => responses.shift() ?? new Response(null, { status: 500 }));

    const status = await getSessionStatusWithRetry({ signal: NEVER_ABORTED, baseDelayMs: 1, onRetry });

    expect(status).toBe(SessionStatus.ACTIVE);
    expect(onRetry).toHaveBeenCalledTimes(2);
  });

  it('should not retry inactive', async () => {
    expect.assertions(2);
    const onRetry = mock(() => undefined);
    mockFetch(async () => new Response(null, { status: 401 }));

    const status = await getSessionStatusWithRetry({ signal: NEVER_ABORTED, baseDelayMs: 1, onRetry });

    expect(status).toBe(SessionStatus.INACTIVE);
    expect(onRetry).not.toHaveBeenCalled();
  });

  it('should return null when aborted while waiting', async () => {
    expect.assertions(1);
    const controller = new AbortController();
    mockFetch(async () => new Response(null, { status: 502 }));

    const promise = getSessionStatusWithRetry({
      signal: controller.signal,
      baseDelayMs: 60_000,
      onRetry: () => controller.abort(),
    });

    expect(await promise).toBeNull();
  });

  it('should return null when aborted during the request', async () => {
    expect.assertions(1);
    const controller = new AbortController();
    mockFetch(async () => {
      controller.abort();

      return Response.json({ session: { active: true } });
    });

    expect(await getSessionStatusWithRetry({ signal: controller.signal })).toBeNull();
  });

  it('should cancel a pending request when aborted', async () => {
    expect.assertions(2);
    const controller = new AbortController();
    let requestSignal: AbortSignal | null | undefined;

    mockFetch(
      (_, init) =>
        new Promise((_resolve, reject) => {
          requestSignal = init?.signal;
          init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        }),
    );

    const promise = getSessionStatusWithRetry({ signal: controller.signal });
    controller.abort();

    expect(await promise).toBeNull();
    expect(requestSignal?.aborted).toBe(true);
  });

  it('should double the delay up to the max', async () => {
    expect.assertions(1);
    const controller = new AbortController();
    const delays: number[] = [];
    mockFetch(async () => new Response(null, { status: 502 }));

    await getSessionStatusWithRetry({
      signal: controller.signal,
      baseDelayMs: 1,
      maxDelayMs: 4,
      onRetry: (attempt, delayMs) => {
        delays.push(delayMs);

        if (attempt === 5) {
          controller.abort();
        }
      },
    });

    expect(delays).toStrictEqual([1, 2, 4, 4, 4, 4]);
  });
});
