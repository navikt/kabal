import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';
import { ServerSentEventManager } from '@/server-sent-events';

class FakeEventSource extends EventTarget {
  static readonly CONNECTING = 0;
  static readonly OPEN = 1;
  static readonly CLOSED = 2;
  static instances: FakeEventSource[] = [];

  readyState = FakeEventSource.CONNECTING;

  constructor(public url: string) {
    super();
    FakeEventSource.instances.push(this);
  }

  close() {
    this.readyState = FakeEventSource.CLOSED;
  }

  fail() {
    this.readyState = FakeEventSource.CLOSED;
    this.dispatchEvent(new Event('error'));
  }
}

const originalEventSource = globalThis.EventSource;
const originalFetch = globalThis.fetch;

let timeouts = new Map<number, () => unknown>();
let nextTimeoutId = 1;
let testUrlCounter = 0;

const runTimeouts = async () => {
  const pending = [...timeouts.values()];
  timeouts = new Map();
  await Promise.all(pending.map((fn) => fn()));
};

const getLastEventSource = () => {
  const last = FakeEventSource.instances.at(-1);

  if (last === undefined) {
    throw new Error('No EventSource created');
  }

  return last;
};

describe('ServerSentEventManager reconnect', () => {
  beforeEach(() => {
    FakeEventSource.instances = [];
    timeouts = new Map();
    globalThis.EventSource = FakeEventSource as unknown as typeof EventSource;
    spyOn(globalThis, 'setTimeout').mockImplementation(((fn: () => unknown) => {
      const id = nextTimeoutId++;
      timeouts.set(id, fn);

      return id;
    }) as unknown as typeof setTimeout);
    spyOn(globalThis, 'clearTimeout').mockImplementation(((id: number) => {
      timeouts.delete(id);
    }) as unknown as typeof clearTimeout);
  });

  afterEach(() => {
    globalThis.EventSource = originalEventSource;
    globalThis.fetch = originalFetch;
    mock.restore();
  });

  const createManager = () => ServerSentEventManager.get('test', `/test-${testUrlCounter++}`);

  it('should reconnect when the session is active', async () => {
    expect.assertions(1);
    globalThis.fetch = mock(async () => Response.json({ session: { active: true } })) as unknown as typeof fetch;
    const manager = createManager();

    getLastEventSource().fail();
    await runTimeouts();

    expect(FakeEventSource.instances).toHaveLength(2);
    manager.close();
  });

  it('should not reconnect when closed while waiting to reconnect', async () => {
    expect.assertions(2);
    const fetchMock = mock(async () => Response.json({ session: { active: true } }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;
    const manager = createManager();

    getLastEventSource().fail();
    manager.close();
    await runTimeouts();

    expect(FakeEventSource.instances).toHaveLength(1);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should not reconnect when closed while the session check is pending', async () => {
    expect.assertions(2);
    let requestSignal: AbortSignal | null | undefined;
    let resolveSession: (res: Response) => void = () => undefined;

    globalThis.fetch = mock(
      (_: RequestInfo | URL, init?: RequestInit) =>
        new Promise<Response>((resolve) => {
          requestSignal = init?.signal;
          resolveSession = resolve;
        }),
    ) as unknown as typeof fetch;

    const manager = createManager();

    getLastEventSource().fail();
    const reconnect = runTimeouts();
    manager.close();
    resolveSession(Response.json({ session: { active: true } }));
    await reconnect;

    expect(requestSignal?.aborted).toBe(true);
    expect(FakeEventSource.instances).toHaveLength(1);
  });
});
