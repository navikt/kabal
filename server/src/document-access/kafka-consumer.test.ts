import { describe, expect, it, jest } from 'bun:test';
import type { Connection } from '@platformatic/kafka';
import {
  ATTEMPT_TIMEOUT_MS,
  CLOSE_TIMEOUT_MS,
  createConsumer,
  FakeStream,
  FIRST_RETRY_MS,
  flush,
  HEALTH_CHECK_MS,
  STABLE_STREAM_MS,
  stallRetryOnStreamClose,
  TRACE_ID,
} from '@/document-access/kafka-consumer.test-utils';

describe('DocumentAccessKafkaConsumer', () => {
  // The happy path: one client, one stream, and records reach the handler with the key as
  // documentId. With no traceparent header, the consumer's own trace ID is used.
  it('connects, joins the group and starts streaming', async () => {
    const { consumer, clients, onMessage } = createConsumer();

    await consumer.connect();

    const [client] = clients;

    expect(clients).toHaveLength(1);
    expect(client?.connectToBrokers).toHaveBeenCalledTimes(1);
    expect(client?.consume).toHaveBeenCalledTimes(1);
    expect(client?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    client?.stream.deliver({ key: 'doc-1', value: 'payload', timestamp: 123n });
    await flush();

    expect(onMessage).toHaveBeenCalledTimes(1);
    expect(onMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId: 'doc-1',
        value: 'payload',
        timestamp: 123n,
        trace_id: TRACE_ID,
      }),
    );
    expect(consumer.getErrors()).toEqual([]);
  });

  // A rejecting handler is a problem with one record, not with Kafka. It's logged, and the
  // stream keeps delivering on the same client.
  it('keeps streaming when the message handler rejects', async () => {
    const { consumer, clients, onMessage } = createConsumer();

    const error = new Error('handler failed');

    onMessage.mockRejectedValueOnce(error);

    await consumer.connect();

    const [client] = clients;

    client?.stream.deliver({ key: 'doc-1' });
    await flush();

    expect(onMessage).toHaveBeenCalledTimes(1);

    // A handler failure is per-message: no rebuild, and the stream stays up.
    expect(consumer.getErrors()).toEqual([]);
    expect(clients).toHaveLength(1);

    client?.stream.deliver({ key: 'doc-2' });
    await flush();

    expect(onMessage).toHaveBeenCalledTimes(2);
  });

  // The main recovery path: a stream error discards the stream, and after the first retry
  // delay a fresh client starts a new one. The old client is closed.
  it('rebuilds the client and starts a new stream after a stream error', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;

    // A broker upgrade kills the stream. Restarting it on the same client used
    // to spin forever, so the client must be replaced.
    first?.stream.fail('Listing offsets failed.');
    await flush();

    expect(consumer.getErrors()).toContain('Stream is not initialized');

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(first?.close).toHaveBeenCalled();
    expect(clients[1]?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // Recovery never gives up: with consume() failing on every client, attempts keep coming
  // for as long as the outage lasts, and the first one after it recovers.
  it('keeps retrying with a fresh client for as long as Kafka is down', async () => {
    jest.useFakeTimers();

    const { consumer, clients, breakKafka } = createConsumer();

    breakKafka(new Error('Listing offsets failed.'));

    await consumer.connect();

    expect(clients).toHaveLength(1);
    expect(consumer.getErrors()).toContain('Stream is not initialized');

    // The backoff is capped, so any outage keeps producing attempts, each on a fresh client.
    let built = clients.length;

    for (let round = 0; round < 5; round++) {
      jest.advanceTimersByTime(60_000);
      await flush();

      expect(clients.length).toBeGreaterThan(built);
      expect(consumer.getErrors()).toContain('Stream is not initialized');

      built = clients.length;
    }

    // Kafka comes back: the next attempt succeeds without a restart.
    breakKafka(null);
    jest.advanceTimersByTime(60_000);
    await flush();

    expect(consumer.getErrors()).toEqual([]);
    expect(clients.at(-1)?.streams).toHaveLength(1);

    await consumer.close();
    jest.useRealTimers();
  });

  // A stream that ends on its own, without an error, is a failure like any other and gets
  // the same rebuild as a stream error.
  it('rebuilds the client and starts a new stream when the stream ends without an error', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;

    // No 'error', just a close. Recovery must start right away, not wait for
    // the health check.
    first?.stream.end();
    await flush();

    expect(consumer.getErrors()).toContain('Stream is not initialized');

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(clients[1]?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // Only a close we didn't ask for is a failure. Closing the stream ourselves, here via
  // close(), must not start a recovery.
  it('does not treat its own stream closes as failures', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;
    const stream = first?.stream;

    // close() makes the stream emit 'close' while our listener is still
    // attached, which must not count as the stream dying.
    await consumer.close();

    expect(stream?.closed).toBe(true);

    jest.advanceTimersByTime(10 * 60_000);
    await flush();

    expect(clients).toHaveLength(1);

    jest.useRealTimers();
  });

  // Failures can come from the client, not just the stream. A client 'error' gets the same
  // recovery as a stream error: the stream is discarded and the client rebuilt.
  it('rebuilds the client when the client itself emits an error', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;
    const stream = first?.stream;

    // The client emits 'error' when rejoining the group after a failed
    // heartbeat gives up. With no listener, EventEmitter would throw here.
    expect(() => first?.emit('error', new Error('Rejoining the group failed.'))).not.toThrow();
    await flush();

    expect(stream?.close).toHaveBeenCalled();
    expect(consumer.getErrors()).toContain('Stream is not initialized');

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(first?.close).toHaveBeenCalled();
    expect(clients[1]?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // A stuck heartbeat, e.g. on a half-open socket to the coordinator, leaves the client
  // looking healthy, so the stall event must get the same rebuild as a client error.
  it('rebuilds the client when its heartbeat stalls', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;
    const stream = first?.stream;

    // Heartbeats fail while the stream keeps working, so the client looks healthy.
    expect(consumer.getErrors()).toEqual([]);

    first?.emit('consumer:heartbeat:stalled', {
      lastError: new Error('Request timed out'),
      lastHeartbeat: null,
      stalledFor: 102_000,
    });
    await flush();

    expect(stream?.close).toHaveBeenCalled();
    expect(consumer.getErrors()).toContain('Stream is not initialized');

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(first?.close).toHaveBeenCalled();
    expect(clients[1]?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // Recovery reacts to events from the current client only. Acting on one from a replaced
  // client would tear down its healthy replacement.
  it('ignores errors and stalls from a client it has already discarded', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    clients[0]?.stream.fail('Listing offsets failed.');
    await flush();
    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(consumer.getErrors()).toEqual([]);

    // A discarded client may still emit errors or stalls. They must not throw,
    // nor disturb its replacement.
    expect(() => clients[0]?.emit('error', new Error('Closing failed.'))).not.toThrow();
    clients[0]?.emit('consumer:heartbeat:stalled', { lastHeartbeat: null, stalledFor: 102_000 });
    await flush();

    jest.advanceTimersByTime(10 * 60_000);
    await flush();

    expect(clients).toHaveLength(2);
    expect(clients[1]?.stream.closed).toBe(false);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // The health check is the safety net for failures that raise no event. It rebuilds only
  // after two bad checks in a row, and through the usual retry.
  it('rebuilds the client when it goes unhealthy without emitting anything', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;
    const stream = first?.stream;

    // The client reports inactive, with no 'error' or 'close'.
    if (first !== undefined) {
      first.active = false;
    }

    expect(consumer.getErrors()).toContain('Kafka consumer is not active');

    // One unhealthy check is not enough: the client may still heal itself.
    jest.advanceTimersByTime(HEALTH_CHECK_MS);
    await flush();

    expect(clients).toHaveLength(1);
    expect(stream?.closed).toBe(false);

    // The second hands over to the usual retry path.
    jest.advanceTimersByTime(HEALTH_CHECK_MS);
    await flush();

    expect(stream?.close).toHaveBeenCalled();
    expect(clients).toHaveLength(1);

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(first?.close).toHaveBeenCalled();
    expect(clients[1]?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // Only consecutive bad checks count: a client that is unhealthy on alternate checks,
  // healing in between, is never rebuilt.
  it('does not rebuild a client that heals itself between health checks', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;

    if (first === undefined) {
      throw new Error('no client was built');
    }

    // Briefly inactive, as while rejoining after a rebalance.
    first.active = false;

    jest.advanceTimersByTime(HEALTH_CHECK_MS);
    await flush();

    first.active = true;

    // A healthy check resets the count.
    jest.advanceTimersByTime(HEALTH_CHECK_MS);
    await flush();

    first.active = false;

    jest.advanceTimersByTime(HEALTH_CHECK_MS);
    await flush();

    first.active = true;

    jest.advanceTimersByTime(10 * 60_000);
    await flush();

    expect(clients).toHaveLength(1);
    expect(first.stream.closed).toBe(false);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // Kafka calls can't be cancelled, and one can hang for minutes when the brokers silently
  // drop requests. The attempt waiting on it holds #starting, blocking every retry, so it's
  // abandoned after ATTEMPT_TIMEOUT_MS. It keeps running anyway, and if it later gets a
  // stream, that stream must be closed, not installed over the one recovery has set up.
  it('abandons a stuck attempt after ATTEMPT_TIMEOUT_MS and discards its late result once recovery has moved on', async () => {
    jest.useFakeTimers();

    const { consumer, clients, onMessage } = createConsumer();

    const [stuckClient] = clients;

    let resolveConnect: (value: Map<number, Connection>) => void = () => undefined;

    // The first connectToBrokers() stalls, as against brokers that silently drop requests.
    stuckClient?.connectToBrokers.mockImplementationOnce(
      () =>
        new Promise<Map<number, Connection>>((resolve) => {
          resolveConnect = resolve;
        }),
    );

    const connecting = consumer.connect();

    await flush();

    expect(stuckClient?.connectToBrokers).toHaveBeenCalledTimes(1);
    expect(stuckClient?.consume).not.toHaveBeenCalled();
    expect(consumer.getErrors()).toContain('Stream is not initialized');

    // ATTEMPT_TIMEOUT_MS passes: the attempt is abandoned and a retry queued.
    jest.advanceTimersByTime(ATTEMPT_TIMEOUT_MS);
    await connecting;

    expect(clients).toHaveLength(1);
    expect(consumer.getErrors()).toContain('Stream is not initialized');

    // The retry rebuilds the client, and this one isn't stalled.
    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);

    const recovered = clients[1];

    expect(recovered?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    const recoveredStream = recovered?.stream;

    // The stalled call finally resolves, and its retired attempt opens a stream
    // on the discarded client. That stream must be closed, not installed over
    // the recovered one.
    resolveConnect(new Map());
    await flush();
    await flush();

    expect(stuckClient?.streams).toHaveLength(1);
    expect(stuckClient?.streams[0]?.close).toHaveBeenCalled();
    expect(consumer.getErrors()).toEqual([]);
    expect(recoveredStream?.closed).toBe(false);

    // The recovered stream still delivers.
    recoveredStream?.deliver({ key: 'doc-1' });
    await flush();

    expect(onMessage).toHaveBeenCalledTimes(1);

    await consumer.close();
    jest.useRealTimers();
  });

  // Retry delays double from 5 s to a 60 s cap, and reset only once a stream has stayed up
  // for STABLE_STREAM_MS. Resetting on consume() would retry every 5 s for a whole outage.
  it('backs off when streams keep dying right after consume(), and resets once one stays up', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    // A broker upgrade: consume() hands over a stream, then its first offset
    // lookup kills it. That counts as a failure, though consume() succeeded.
    for (const delay of [5_000, 10_000, 20_000, 40_000, 60_000, 60_000]) {
      clients.at(-1)?.stream.fail('Listing offsets failed.');
      await flush();

      const built = clients.length;

      jest.advanceTimersByTime(delay - 1);
      await flush();

      expect(clients).toHaveLength(built);

      jest.advanceTimersByTime(1);
      await flush();

      expect(clients).toHaveLength(built + 1);
    }

    // Kafka is back, and this stream stays up long enough to prove it...
    jest.advanceTimersByTime(STABLE_STREAM_MS);
    await flush();

    expect(consumer.getErrors()).toEqual([]);

    // ...so the next failure starts from the shortest delay again.
    clients.at(-1)?.stream.fail('Connection reset.');
    await flush();

    const built = clients.length;

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(built + 1);

    await consumer.close();
    jest.useRealTimers();
  });

  // A failed LeaveGroup leaves the real client half-closed, its connections still open. The
  // fallback is a second close with memberId cleared, which skips LeaveGroup.
  it('closes a discarded client without LeaveGroup when LeaveGroup fails', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;

    if (first === undefined) {
      throw new Error('no client was built');
    }

    // The brokers are gone, so the forced close's LeaveGroup fails.
    first.closeError = new Error('LeaveGroup failed.');
    first.stream.fail('Listing offsets failed.');
    await flush();

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(first.close).toHaveBeenCalledTimes(2);
    expect(first.memberId).toBeNull();
    expect(first.closed).toBe(true);

    await consumer.close();
    jest.useRealTimers();
  });

  // Disposal stops after two close attempts. If the fallback fails too, the failure is
  // logged and the client dropped, not retried.
  it('abandons a discarded client that fails to close even without LeaveGroup', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [first] = clients;

    if (first === undefined) {
      throw new Error('no client was built');
    }

    first.close.mockImplementation(async (_force, callback) => {
      callback?.(new Error('Closing the connections failed.'));
    });
    first.stream.fail('Listing offsets failed.');
    await flush();

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(2);
    expect(first.close).toHaveBeenCalledTimes(2);

    // No retries: every rebuild in a long outage would add another chain.
    jest.advanceTimersByTime(60 * 60_000);
    await flush();

    expect(first.close).toHaveBeenCalledTimes(2);

    await consumer.close();
    jest.useRealTimers();
  });

  // close() can't cancel an attempt in flight. A stream that attempt gets afterwards must
  // be closed, and no retry may follow.
  it('discards a stream that arrives after close()', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    const [client] = clients;
    const late = new FakeStream();
    let deliverStream: (stream: FakeStream) => void = () => undefined;

    client?.consume.mockImplementationOnce(
      () =>
        new Promise<FakeStream>((resolve) => {
          deliverStream = resolve;
        }),
    );

    const connecting = consumer.connect();
    await flush();

    expect(client?.consume).toHaveBeenCalledTimes(1);

    // Shutdown lands while consume() is still in flight.
    await consumer.close();

    deliverStream(late);
    await connecting;

    // Closed, not installed on a consumer that is gone.
    expect(late.close).toHaveBeenCalled();
    expect(consumer.getErrors()).toContain('Stream is not initialized');

    jest.advanceTimersByTime(10 * 60_000);
    await flush();

    expect(clients).toHaveLength(1);

    jest.useRealTimers();
  });

  // The SIGTERM handler awaits close(), so a close that hangs would hold up shutdown.
  // close() gives up after CLOSE_TIMEOUT_MS instead.
  it('gives up on a close() that hangs, so shutdown can go on', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    // During an outage, closing the stream can stall.
    clients[0]?.stream.close.mockImplementationOnce(() => new Promise<void>(() => undefined));

    let closed = false;

    const closing = consumer.close().then(() => {
      closed = true;
    });

    await flush();

    expect(closed).toBe(false);

    jest.advanceTimersByTime(CLOSE_TIMEOUT_MS);
    await closing;

    expect(closed).toBe(true);

    jest.useRealTimers();
  });

  // A failure while closing, here in LeaveGroup, is logged, not thrown, so the SIGTERM
  // handler still gets through the rest of the shutdown.
  it('never throws from close(), so shutdown can go on', async () => {
    const { consumer, clients } = createConsumer();

    await consumer.connect();

    clients[0]?.leaveGroup.mockRejectedValueOnce(new Error('LeaveGroup failed.'));

    await expect(consumer.close()).resolves.toBeUndefined();
  });

  // A discarded stream keeps its listeners until its close finishes, which can stall. Its
  // records must be dropped meanwhile, not handled alongside the replacement's.
  it('stops delivering records from a stream as soon as it is discarded', async () => {
    jest.useFakeTimers();

    const { consumer, clients, onMessage } = createConsumer();

    await consumer.connect();

    const [first] = clients;
    const stream = first?.stream;

    // Closing the stream stalls, and recovery doesn't wait for it: the stream is
    // discarded but not yet closed.
    stream?.close.mockImplementationOnce(() => new Promise<void>(() => undefined));

    // Something other than the stream fails, so the stream is still alive.
    first?.emit('error', new Error('Rejoining the group failed.'));
    await flush();

    expect(stream?.close).toHaveBeenCalled();

    // A record still arriving on it must not be processed. It was never
    // committed, so the replacement delivers it again.
    stream?.deliver({ key: 'doc-1' });
    await flush();

    expect(onMessage).not.toHaveBeenCalled();

    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    clients[1]?.stream.deliver({ key: 'doc-1' });
    await flush();

    expect(onMessage).toHaveBeenCalledTimes(1);

    await consumer.close();
    jest.useRealTimers();
  });

  // #start() turns away a retry while an attempt runs. The retry must be deferred, not
  // dropped, or a client that failed mid-attempt would stay in use.
  it('does not lose a retry that comes due while an attempt is still running', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    const [first] = clients;
    let deliverStream: (stream: FakeStream) => void = () => undefined;

    first?.consume.mockImplementationOnce(
      () =>
        new Promise<FakeStream>((resolve) => {
          deliverStream = resolve;
        }),
    );

    const connecting = consumer.connect();
    await flush();

    // The client gives up rejoining the group while consume() is in flight.
    first?.emit('error', new Error('Rejoining the group failed.'));

    // The retry comes due before the attempt has finished.
    jest.advanceTimersByTime(FIRST_RETRY_MS);
    await flush();

    expect(clients).toHaveLength(1);

    // The attempt then succeeds on the client that failed. The retry must still
    // run, replacing both.
    const stream = new FakeStream();

    deliverStream(stream);
    await connecting;
    await flush();

    expect(stream.close).toHaveBeenCalled();
    expect(clients).toHaveLength(2);
    expect(clients[1]?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // A retry starts by closing the old stream, which can outlast ATTEMPT_TIMEOUT_MS. When the
  // close finally finishes, a later retry has recovered, and the abandoned one must leave it alone.
  it('stops an attempt abandoned while closing the old stream from rebuilding over its replacement', async () => {
    jest.useFakeTimers();

    const harness = createConsumer();
    const { consumer, clients } = harness;

    const finishClose = await stallRetryOnStreamClose(harness);

    // The stuck retry is abandoned, and the next one, after a doubled backoff, recovers.
    jest.advanceTimersByTime(ATTEMPT_TIMEOUT_MS);
    await flush();
    jest.advanceTimersByTime(2 * FIRST_RETRY_MS);
    await flush();

    const [, recovered] = clients;

    expect(clients).toHaveLength(2);
    expect(recovered?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);

    // The abandoned attempt resumes. It must not touch the recovered client.
    finishClose();
    await flush();

    expect(clients).toHaveLength(2);
    expect(recovered?.closed).toBe(false);
    expect(recovered?.stream.closed).toBe(false);
    expect(consumer.getErrors()).toEqual([]);

    await consumer.close();
    jest.useRealTimers();
  });

  // A retry stuck closing the old stream when close() runs must stop once that close
  // finishes, rather than build a client after shutdown.
  it('does not build a client for an attempt that resumes after close()', async () => {
    jest.useFakeTimers();

    const harness = createConsumer();
    const { consumer, clients } = harness;

    const finishClose = await stallRetryOnStreamClose(harness);

    await consumer.close();

    // Nothing would ever close a client built now.
    finishClose();
    await flush();

    expect(clients).toHaveLength(1);

    jest.useRealTimers();
  });

  // A retry queued before close() must never fire: close() clears its timer, and #start()
  // bails out once closed.
  it('stops retrying once closed', async () => {
    jest.useFakeTimers();

    const { consumer, clients, breakKafka } = createConsumer();

    breakKafka(new Error('Listing offsets failed.'));

    await consumer.connect();

    expect(clients).toHaveLength(1);

    await consumer.close();

    jest.advanceTimersByTime(10 * 60_000);
    await flush();

    expect(clients).toHaveLength(1);

    jest.useRealTimers();
  });
});
