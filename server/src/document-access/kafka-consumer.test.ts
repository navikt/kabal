import { describe, expect, it, jest, mock } from 'bun:test';
import { EventEmitter } from 'node:events';
import type { Connection } from '@platformatic/kafka';
import {
  type CreateKafkaClient,
  type DocumentAccessKafkaClient,
  DocumentAccessKafkaConsumer,
  type DocumentAccessStream,
} from '@/document-access/kafka-consumer';

const TRACE_ID = 'test-trace';

/** How long the consumer waits before its first retry. */
const FIRST_RETRY_MS = 5_000;

/** Yields a few times so queued promise callbacks in the recovery chain run. */
const flush = async () => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};

/** Controllable stand-in for a Kafka message stream. */
class FakeStream extends EventEmitter implements DocumentAccessStream {
  closed = false;
  close = mock(async () => {
    this.closed = true;
  });

  /** Simulate the stream dying the way a broker outage kills it. */
  fail = (message: string) => this.emit('error', new Error(message));
}

/** Controllable stand-in for a @platformatic/kafka Consumer. */
class FakeClient implements DocumentAccessKafkaClient {
  connected = false;
  active = false;
  closed = false;
  streams: FakeStream[] = [];

  /** When set, the corresponding step rejects instead of succeeding. */
  connectError: Error | null = null;
  consumeError: Error | null = null;

  connectToBrokers = mock(async () => {
    if (this.connectError !== null) {
      throw this.connectError;
    }

    this.connected = true;

    // The real client resolves with its broker connections. Nothing here reads
    // them, but the seam keeps the real signature, so an empty map it is.
    return new Map<number, Connection>();
  });

  joinGroup = mock(async () => {
    this.active = true;

    return 'group';
  });

  consume = mock(async () => {
    if (this.consumeError !== null) {
      throw this.consumeError;
    }

    const stream = new FakeStream();
    this.streams.push(stream);

    return stream;
  });

  isConnected = () => this.connected && !this.closed;
  isActive = () => this.active && !this.closed;
  leaveGroup = mock(async () => undefined);

  close = mock(async () => {
    this.connected = false;
    this.active = false;
    this.closed = true;
  });

  get stream() {
    const stream = this.streams.at(-1);

    if (stream === undefined) {
      throw new Error('no stream was started');
    }

    return stream;
  }
}

interface Harness {
  consumer: DocumentAccessKafkaConsumer;
  /** Every client built so far, oldest first. A rebuild appends a new one. */
  clients: FakeClient[];
  /**
   * Makes the current and every future client fail to start a stream, the way a
   * cluster that is mid-upgrade does. Pass null to let Kafka come back.
   */
  breakKafka: (error: Error | null) => void;
}

const createConsumer = (): Harness => {
  const clients: FakeClient[] = [];
  let consumeError: Error | null = null;

  const createClient: CreateKafkaClient = () => {
    const client = new FakeClient();
    client.consumeError = consumeError;
    clients.push(client);

    return client;
  };

  const consumer = new DocumentAccessKafkaConsumer(async () => undefined, TRACE_ID, createClient);

  const breakKafka = (error: Error | null) => {
    consumeError = error;

    for (const client of clients) {
      client.consumeError = error;
    }
  };

  return { consumer, clients, breakKafka };
};

describe('DocumentAccessKafkaConsumer', () => {
  it('connects, joins the group and starts streaming', async () => {
    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const [client] = clients;

    expect(clients).toHaveLength(1);
    expect(client?.connectToBrokers).toHaveBeenCalledTimes(1);
    expect(client?.joinGroup).toHaveBeenCalledTimes(1);
    expect(client?.streams).toHaveLength(1);
    expect(consumer.getErrors()).toEqual([]);
  });

  it('rebuilds the client and starts a new stream after a stream error', async () => {
    jest.useFakeTimers();

    const { consumer, clients } = createConsumer();

    await consumer.connect();

    const first = clients[0];

    // A broker upgrade kills the stream. Restarting the stream on the same
    // client is what used to spin forever, so the client must be replaced.
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

  it('keeps retrying with a fresh client for as long as Kafka is down', async () => {
    jest.useFakeTimers();

    const { consumer, clients, breakKafka } = createConsumer();

    breakKafka(new Error('Listing offsets failed.'));

    await consumer.connect();

    expect(clients).toHaveLength(1);
    expect(consumer.getErrors()).toContain('Stream is not initialized');

    // The backoff is capped, so an outage of any length keeps producing
    // attempts, and each one starts from a client with no stale state.
    let built = clients.length;

    for (let round = 0; round < 5; round++) {
      jest.advanceTimersByTime(60_000);
      await flush();

      expect(clients.length).toBeGreaterThan(built);
      expect(consumer.getErrors()).toContain('Stream is not initialized');

      built = clients.length;
    }

    // Kafka comes back: the next attempt succeeds, with no manual restart.
    breakKafka(null);
    jest.advanceTimersByTime(60_000);
    await flush();

    expect(consumer.getErrors()).toEqual([]);
    expect(clients.at(-1)?.streams).toHaveLength(1);

    await consumer.close();
    jest.useRealTimers();
  });

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
