/** Fakes and helpers for kafka-consumer.test.ts. */

import { expect, jest, mock } from 'bun:test';
import { EventEmitter } from 'node:events';
import type { Connection, Message } from '@platformatic/kafka';
import {
  type CreateKafkaClient,
  type DocumentAccessKafkaClient,
  DocumentAccessKafkaConsumer,
  type DocumentAccessMessage,
  type DocumentAccessStream,
} from '@/document-access/kafka-consumer';

type FakeMessage = Message<string, string, string, string>;

export const TRACE_ID = 'test-trace';

// Copies of private constants in kafka-consumer.ts. Keep them in sync.

/** How long the consumer waits before its first retry. */
export const FIRST_RETRY_MS = 5_000;

/** How long an attempt may run before it's abandoned. */
export const ATTEMPT_TIMEOUT_MS = 30_000;

/** How long a stream has to stay up before the backoff resets. */
export const STABLE_STREAM_MS = 60_000;

/** How long close() waits before abandoning a shutdown that hangs. */
export const CLOSE_TIMEOUT_MS = 10_000;

/** How often the consumer checks its own health. */
export const HEALTH_CHECK_MS = 15_000;

/** Yields a few times so queued promise callbacks in the recovery chain run. */
export const flush = async () => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};

/** Controllable stand-in for a Kafka message stream. */
export class FakeStream extends EventEmitter implements DocumentAccessStream {
  closed = false;
  close = mock(async () => {
    this.#terminate();
  });

  /** Simulate a broker outage killing the stream: destroy(error). */
  fail = (message: string) => {
    this.emit('error', new Error(message));
    this.#terminate();
  };

  /** Simulate the stream ending on its own, without an error. */
  end = () => this.#terminate();

  /** Like a Readable, every way of terminating ends in a single 'close'. */
  #terminate = () => {
    if (this.closed) {
      return;
    }

    this.closed = true;
    this.emit('close');
  };

  /** Simulate the broker delivering a record on this stream. */
  deliver = (message: Partial<FakeMessage> & { key: string }) => {
    const record: FakeMessage = {
      value: 'value',
      topic: 'document-write-access',
      partition: 0,
      timestamp: 0n,
      offset: 0n,
      leaderEpoch: 0,
      headers: new Map(),
      headerEntries: [],
      metadata: {},
      commit: mock(async () => undefined),
      toJSON: () => {
        throw new Error('not implemented');
      },
      ...message,
    };

    this.emit('data', record);

    return record;
  };
}

/** The callback the real client's close(force, callback) overload takes. */
type CloseCallback = (error: Error | null) => void;

/** Controllable stand-in for a @platformatic/kafka Consumer. */
export class FakeClient extends EventEmitter implements DocumentAccessKafkaClient {
  connected = false;
  active = false;
  closed = false;
  streams: FakeStream[] = [];
  memberId: string | null = null;

  /** When set, consume() rejects instead of succeeding. */
  consumeError: Error | null = null;
  /**
   * When set, close() fails like a forced close whose LeaveGroup can't reach
   * the brokers: the client stays open. Like the real client, close() skips
   * LeaveGroup, and so succeeds, when memberId is null.
   */
  closeError: Error | null = null;

  connectToBrokers = mock(async () => {
    this.connected = true;

    // The real signature resolves with the broker connections; nothing reads them.
    return new Map<number, Connection>();
  });

  consume = mock(async () => {
    if (this.consumeError !== null) {
      throw this.consumeError;
    }

    // Like the real client, consume() on a fresh client joins the group itself.
    this.active = true;
    this.memberId = 'member';

    const stream = new FakeStream();
    this.streams.push(stream);

    return stream;
  });

  isConnected = () => this.connected && !this.closed;
  isActive = () => this.active && !this.closed;
  leaveGroup = mock(async () => undefined);

  /** Both overloads of the real close(): promise, or (force, callback). */
  close = mock(async (force?: boolean | CloseCallback, callback?: CloseCallback): Promise<void> => {
    const done = typeof force === 'function' ? force : callback;
    const error = this.memberId === null ? null : this.closeError;

    if (error === null) {
      this.connected = false;
      this.active = false;
      this.closed = true;
      this.memberId = null;
    }

    if (done !== undefined) {
      done(error);

      return;
    }

    if (error !== null) {
      throw error;
    }
  });

  get stream() {
    const stream = this.streams.at(-1);

    if (stream === undefined) {
      throw new Error('no stream was started');
    }

    return stream;
  }
}

export interface Harness {
  consumer: DocumentAccessKafkaConsumer;
  /** Every client built so far, oldest first. A rebuild appends a new one. */
  clients: FakeClient[];
  /**
   * Makes consume() reject on the current and every future client, as when the
   * brokers are unreachable. Pass null to let Kafka come back.
   */
  breakKafka: (error: Error | null) => void;
  /** The handler passed to the consumer, so tests can assert on delivered messages. */
  onMessage: ReturnType<typeof mock<(message: DocumentAccessMessage) => Promise<void>>>;
}

export const createConsumer = (): Harness => {
  const clients: FakeClient[] = [];
  let consumeError: Error | null = null;
  const onMessage = mock(async (_message: DocumentAccessMessage) => undefined);

  const createClient: CreateKafkaClient = () => {
    const client = new FakeClient();
    client.consumeError = consumeError;
    clients.push(client);

    return client;
  };

  const consumer = new DocumentAccessKafkaConsumer(onMessage, TRACE_ID, createClient);

  const breakKafka = (error: Error | null) => {
    consumeError = error;

    for (const client of clients) {
      client.consumeError = error;
    }
  };

  return { consumer, clients, breakKafka, onMessage };
};

/**
 * Connects, then leaves a retry stuck closing a live stream: a client error
 * queues the retry mid-attempt, the attempt installs a stream whose close
 * hangs, and the retry comes due. Returns a function that lets the close finish.
 */
export const stallRetryOnStreamClose = async ({ consumer, clients }: Harness): Promise<() => void> => {
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

  first?.emit('error', new Error('Rejoining the group failed.'));

  const stream = new FakeStream();
  let finishClose: () => void = () => undefined;

  stream.close.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finishClose = resolve;
      }),
  );

  deliverStream(stream);
  await connecting;

  jest.advanceTimersByTime(FIRST_RETRY_MS);
  await flush();

  expect(stream.close).toHaveBeenCalled();

  return () => finishClose();
};
