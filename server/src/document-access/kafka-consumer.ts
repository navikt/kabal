import type { ConnectionOptions } from 'node:tls';
import { propagation, ROOT_CONTEXT, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { type ConsumeOptions, Consumer, type Message } from '@platformatic/kafka';
import client from 'prom-client';
import { requiredEnvString } from '@/config/env-var';
import { parseTraceparent } from '@/helpers/traceparent';
import { getLogger } from '@/logger';
import { proxyRegister } from '@/prometheus/types';
import { tracer } from '@/tracing/tracer';

const log = getLogger('document-write-access-kafka-consumer');

const TOPIC = 'klage.smart-document-write-access.v1';

/** Backoff bounds between recovery attempts. */
const MIN_RETRY_DELAY_MS = 5_000;
const MAX_RETRY_DELAY_MS = 60_000;

/**
 * Upper bound for a single recovery attempt. Kafka requests that are in flight
 * when brokers disappear can stay pending indefinitely; without this a wedged
 * attempt would hold the in-flight guard forever and silently stop all further
 * recovery - the exact failure mode that used to require a pod restart.
 */
const ATTEMPT_TIMEOUT_MS = 30_000;

const kafkaBrokers = requiredEnvString('KAFKA_BROKERS')
  .split(',')
  .map((b) => b.trim())
  .filter((b) => b.length > 0);

if (kafkaBrokers.length === 0) {
  throw new Error('KAFKA_BROKERS must contain at least one broker');
}

const KAFKA_TLS: ConnectionOptions = {
  key: requiredEnvString('KAFKA_PRIVATE_KEY'),
  cert: requiredEnvString('KAFKA_CERTIFICATE'),
  ca: requiredEnvString('KAFKA_CA'),
};

/**
 * Builds a fresh client. Recovery throws the previous one away instead of
 * reusing it, so everything a Consumer caches - broker connections, cluster
 * metadata and group membership - is rebuilt from the bootstrap brokers.
 */
const createConsumer = (groupId: string) =>
  new Consumer<string, string, string, string>({
    groupId,
    clientId: 'kabal-frontend',
    bootstrapBrokers: kafkaBrokers,
    tls: KAFKA_TLS,
    metrics: { registry: proxyRegister, client },
    deserializers: {
      key: (data) => data?.toString('utf-8'),
      value: (data) => data?.toString('utf-8'),
      headerKey: (data) => data?.toString('utf-8'),
      headerValue: (data) => data?.toString('utf-8'),
    },
  });

type DocumentAccessConsumer = Consumer<string, string, string, string>;

/**
 * The part of a MessagesStream this class drives.
 *
 * Declared rather than derived, because MessagesStream is a concrete Readable
 * subclass built around a live Consumer: there is no way to stand in for it in
 * a test. Only the members below are widened, and only as far as they have to
 * be - the record type is the client's own Message, and the chainable methods
 * keep their polymorphic `this`, so a real MessagesStream satisfies this as-is.
 */
export interface DocumentAccessStream {
  readonly closed: boolean;
  close(): Promise<void>;
  removeAllListeners(): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: 'data', listener: (message: Message<string, string, string, string>) => void): this;
}

/**
 * The part of the Kafka client this class drives. Derived from Consumer so the
 * seam keeps the client's real signatures, except for consume(): its return
 * type is narrowed to the stream surface above, which is what makes the whole
 * thing fakeable. A real Consumer still has to satisfy it, checked where
 * createConsumer is used as the default factory.
 */
export type DocumentAccessKafkaClient = Pick<
  DocumentAccessConsumer,
  'connectToBrokers' | 'joinGroup' | 'isConnected' | 'isActive' | 'leaveGroup' | 'close'
> & {
  consume: (options: ConsumeOptions<string, string, string, string>) => Promise<DocumentAccessStream>;
};

/** Builds the client used for the next attempt. Injectable for tests. */
export type CreateKafkaClient = (groupId: string) => DocumentAccessKafkaClient;

/** A single Kafka record handed to the message handler. */
export interface DocumentAccessMessage {
  documentId: string;
  value: string | undefined;
  timestamp: bigint;
  commit: () => void | Promise<void>;
  trace_id: string;
}

export type DocumentAccessMessageHandler = (message: DocumentAccessMessage) => Promise<void>;

/** The subset of the Kafka consumer the access service depends on. Injectable for tests. */
export interface DocumentAccessKafkaConsumerApi {
  connect: () => Promise<void>;
  getErrors: () => string[];
  close: () => Promise<void>;
}

/**
 * Owns the Kafka consumer lifecycle for document write-access updates end to
 * end: connect, detect breakage, recover from it, surface health, and close.
 * Each record is handed to the injected handler inside a CONSUMER span; how a
 * record mutates access state is the caller's concern.
 *
 * Recovery is self-driven and lives here rather than in a caller's loop, so
 * there is exactly one owner of the retry state (in-flight guard, attempt
 * count, backoff timer) and no way for two drivers to race over the same
 * consumer.
 */
export class DocumentAccessKafkaConsumer implements DocumentAccessKafkaConsumerApi {
  /**
   * Stable for the lifetime of the process, so a rebuilt client rejoins the
   * same group and resumes from the offsets it committed before the outage.
   */
  readonly #groupId = crypto.randomUUID();

  #consumer: DocumentAccessKafkaClient;

  #stream: DocumentAccessStream | null = null;

  /** True while an attempt is in flight. Keeps overlapping attempts out. */
  #starting = false;

  /** Handle of the scheduled next attempt, if any. */
  #retryTimer: ReturnType<typeof setTimeout> | null = null;

  /** Consecutive failed attempts. Drives the backoff. */
  #attempts = 0;

  /**
   * Bumped whenever an attempt starts or is abandoned. An attempt that outlives
   * its timeout keeps running — there is no way to cancel an in-flight Kafka
   * request — so it checks this before installing anything, and quietly throws
   * its result away if a newer attempt has since taken over.
   */
  #generation = 0;

  /** Set by close() so no scheduled or in-flight attempt can resurrect us. */
  #closed = false;

  readonly #onMessage: DocumentAccessMessageHandler;
  readonly #trace_id: string;
  readonly #createClient: CreateKafkaClient;

  constructor(
    onMessage: DocumentAccessMessageHandler,
    trace_id: string,
    createClient: CreateKafkaClient = createConsumer,
  ) {
    this.#onMessage = onMessage;
    this.#trace_id = trace_id;
    this.#createClient = createClient;
    this.#consumer = createClient(this.#groupId);
  }

  /**
   * Starts consuming. Failures are logged and swallowed rather than thrown:
   * startup must not fail because Kafka is down, and from here on this instance
   * retries on its own until it succeeds or is closed. Callers only connect once.
   */
  connect = () => this.#start(false);

  /**
   * A single attempt at getting back to "connected, joined and streaming".
   *
   * `rebuild` throws the client away first. A stream is only the top layer: a
   * broker upgrade also invalidates the client's connections, its cached
   * cluster metadata and its group membership, and re-running consume() on that
   * client just fails against the same stale state forever. Rebuilding is what
   * a pod restart used to do, done in-process.
   */
  #start = async (rebuild: boolean): Promise<void> => {
    if (this.#closed || this.#starting) {
      return;
    }

    this.#starting = true;
    this.#clearRetryTimer();

    this.#generation += 1;
    const generation = this.#generation;
    const trace_id = this.#trace_id;

    try {
      await withTimeout(this.#attempt(rebuild, generation), ATTEMPT_TIMEOUT_MS, 'Kafka consumer start timed out');

      this.#attempts = 0;

      log.info({ msg: 'Kafka consumer stream started', trace_id, data: { group_id: this.#groupId } });
    } catch (error) {
      this.#attempts += 1;

      // Retire this attempt: if it timed out it is still running somewhere, and
      // must not install a stream once we have moved on.
      this.#generation += 1;

      log.error({
        msg: `Failed to start Kafka consumer (attempt ${this.#attempts}), degrading to API fallback`,
        trace_id,
        error,
      });

      // Anything half-started is dropped by the rebuild on the next attempt.
      this.#scheduleRetry();
    } finally {
      this.#starting = false;
    }
  };

  #attempt = async (rebuild: boolean, generation: number): Promise<void> => {
    const trace_id = this.#trace_id;

    await this.#discardStream();

    if (rebuild) {
      this.#rebuildClient();
    }

    // Pinned for the rest of the attempt: an abandoned attempt must keep working
    // on the client it started with, never on the one that replaced it.
    const consumer = this.#consumer;

    log.debug({ msg: 'Connecting to Kafka brokers...', trace_id });
    await consumer.connectToBrokers();
    log.debug({ msg: 'Kafka consumer connected to brokers', trace_id });

    log.debug({ msg: 'Kafka consumer joining group...', trace_id });
    const groupId = await consumer.joinGroup({});
    log.debug({ msg: `Kafka consumer joined group ${groupId}`, trace_id, data: { group_id: groupId } });

    await this.#startStream(consumer, generation);
  };

  /**
   * Swaps in a fresh client. The old one is closed without awaiting it: closing
   * sends a LeaveGroup request, which is precisely what cannot be relied on
   * when the brokers are gone, and recovery must never block on it.
   */
  #rebuildClient = (): void => {
    const previous = this.#consumer;

    this.#consumer = this.#createClient(this.#groupId);

    log.debug({ msg: 'Kafka client rebuilt, discarding the previous one', trace_id: this.#trace_id });

    // The callback form, because the promise overload is only selected when no
    // force flag is passed.
    previous.close(true, (error) => {
      if (error !== null) {
        log.warn({ msg: 'Failed to close the discarded Kafka client', trace_id: this.#trace_id, error });
      }
    });
  };

  /** Queues the next attempt with a capped exponential backoff. */
  #scheduleRetry = (): void => {
    if (this.#closed || this.#retryTimer !== null) {
      return;
    }

    const delay = Math.min(MIN_RETRY_DELAY_MS * 2 ** Math.max(this.#attempts - 1, 0), MAX_RETRY_DELAY_MS);

    log.info({ msg: `Retrying Kafka consumer in ${delay} ms`, trace_id: this.#trace_id });

    this.#retryTimer = setTimeout(() => {
      this.#retryTimer = null;

      // Always rebuild: every path that lands here left broken client state behind.
      void this.#start(true);
    }, delay);

    // Must not hold the event loop open during shutdown.
    this.#retryTimer.unref();
  };

  #clearRetryTimer = (): void => {
    if (this.#retryTimer === null) {
      return;
    }

    clearTimeout(this.#retryTimer);
    this.#retryTimer = null;
  };

  getErrors = (): string[] => {
    const errors: string[] = [];

    if (!this.#consumer.isConnected()) {
      errors.push('Kafka consumer is not connected');
    }

    if (!this.#consumer.isActive()) {
      errors.push('Kafka consumer is not active');
    }

    if (this.#stream === null) {
      errors.push('Stream is not initialized');
    }

    if (this.#stream?.closed === true) {
      errors.push('Stream is closed');
    }

    return errors;
  };

  close = async (): Promise<void> => {
    const trace_id = this.#trace_id;

    log.debug({ msg: 'Closing Kafka consumer...', trace_id });

    // Stops scheduled retries, and stops an in-flight one from leaving a stream behind.
    this.#closed = true;
    this.#clearRetryTimer();

    if (this.#stream === null) {
      log.debug({ msg: 'Kafka consumer stream not initialized, nothing to close', trace_id });
    }

    await this.#discardStream();

    log.debug({ msg: 'Kafka consumer leaving group...', trace_id });

    if (this.#consumer.isConnected()) {
      await this.#consumer.leaveGroup();
      log.debug({ msg: 'Kafka consumer left group', trace_id });
    } else {
      log.debug({ msg: 'Kafka consumer was not connected, skipping leaveGroup', trace_id });
    }

    log.debug({ msg: 'Kafka consumer closing...', trace_id });
    await this.#consumer.close();
    log.debug({ msg: 'Kafka consumer closed', trace_id });
  };

  /** Closes and forgets the current stream, if any. Best-effort — never throws. */
  #discardStream = async (): Promise<void> => {
    const stream = this.#stream;

    if (stream === null) {
      return;
    }

    this.#stream = null;

    await closeStream(stream, this.#trace_id);
  };

  #startStream = async (consumer: DocumentAccessKafkaClient, generation: number): Promise<void> => {
    const trace_id = this.#trace_id;

    log.debug({ msg: 'Kafka consumer starting stream...', trace_id });

    const stream = await consumer.consume({
      autocommit: false,
      topics: [TOPIC],
      sessionTimeout: 10_000,
      heartbeatInterval: 500,
      mode: 'committed',
    });

    if (this.#closed || generation !== this.#generation) {
      // We were closed, or timed out and superseded, while connecting. Do not
      // leave a live stream behind on a client nobody owns any more.
      log.debug({ msg: 'Discarding stream from a superseded Kafka consumer attempt', trace_id });

      await closeStream(stream, trace_id);

      return;
    }

    this.#stream = stream;

    stream.on('error', (error) => {
      log.error({ msg: 'Kafka consumer stream error', trace_id, error });

      if (this.#stream !== stream) {
        return; // Already replaced or discarded.
      }

      // Only tear down here. Recovery goes through the same rebuild-and-retry
      // path as every other failure, instead of restarting the stream on top of
      // a client that may be just as broken.
      void this.#discardStream().then(() => this.#scheduleRetry());
    });

    log.debug({ msg: 'Kafka consumer stream listener starting...', trace_id });

    stream.on('data', async ({ key: documentId, value, timestamp, headers, commit }) => {
      let message_trace_id = trace_id;

      try {
        // Extract trace_id from Kafka message headers for log correlation.
        // Kafka messages are not covered by OTel HTTP instrumentation, so we parse manually.
        const traceparentHeader = headers.get('traceparent');
        message_trace_id =
          traceparentHeader === undefined ? trace_id : (parseTraceparent(traceparentHeader).trace_id ?? trace_id);

        const parentContext =
          traceparentHeader === undefined
            ? ROOT_CONTEXT
            : propagation.extract(ROOT_CONTEXT, { traceparent: traceparentHeader });

        await tracer.startActiveSpan(
          'kafka.process_document_access',
          {
            kind: SpanKind.CONSUMER,
            attributes: {
              'messaging.system': 'kafka',
              'messaging.operation': 'process',
              'messaging.destination.name': TOPIC,
            },
          },
          parentContext,
          async (span) => {
            try {
              await this.#onMessage({ documentId, value, timestamp, commit, trace_id: message_trace_id });
              span.setStatus({ code: SpanStatusCode.OK });
            } catch (error) {
              span.setStatus({ code: SpanStatusCode.ERROR });

              if (error instanceof Error) {
                span.recordException(error);
              }

              throw error;
            } finally {
              span.end();
            }
          },
        );
      } catch (error) {
        log.error({
          msg: 'Failed to process Kafka document access message',
          trace_id: message_trace_id,
          data: { document_id: documentId },
          error,
        });
      }
    });

    log.debug({ msg: 'Kafka consumer stream listener started', trace_id });
  };
}

/**
 * Closes a stream and drops its listeners. Best-effort: a stream that died on an
 * error typically rejects on close, and throwing here would abort the recovery
 * that follows.
 */
const closeStream = async (stream: DocumentAccessStream, trace_id: string) => {
  log.debug({ msg: 'Closing Kafka consumer stream...', trace_id });

  try {
    await stream.close();
  } catch (error) {
    log.warn({ msg: 'Failed to close Kafka consumer stream, discarding it anyway', trace_id, error });
  }

  stream.removeAllListeners();
  log.debug({ msg: 'Kafka consumer stream closed', trace_id });
};

/**
 * Rejects after `ms` if `promise` has not settled. The underlying operation is
 * abandoned, not cancelled - the client it belongs to is thrown away by the
 * next attempt.
 */
const withTimeout = async <T>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
};
