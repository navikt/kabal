import type { ConnectionOptions } from 'node:tls';
import { propagation, ROOT_CONTEXT, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { type ConsumeOptions, Consumer, type ConsumerHeartbeatStalledPayload, type Message } from '@platformatic/kafka';
import client from 'prom-client';
import { requiredEnvString } from '@/config/env-var';
import { parseTraceparent } from '@/helpers/traceparent';
import { getLogger } from '@/logger';
import { proxyRegister } from '@/prometheus/types';
import { tracer } from '@/tracing/tracer';

const log = getLogger('document-write-access-kafka-consumer');

const TOPIC = 'klage.smart-document-write-access.v1';

/** Backoff bounds for retries. */
const MIN_RETRY_DELAY_MS = 5_000;
const MAX_RETRY_DELAY_MS = 60_000;

/**
 * How long a stream must stay up and healthy before the backoff resets.
 * consume() resolves before the stream's first offset lookup has finished, and
 * that lookup is what fails during a broker upgrade. Resetting on consume()
 * would retry every MIN_RETRY_DELAY_MS for the whole outage.
 */
const STABLE_STREAM_MS = 60_000;

/**
 * Upper bound for one attempt. Requests in flight when the brokers disappear
 * can take minutes to fail, and a stuck attempt holds #starting, blocking all recovery.
 */
const ATTEMPT_TIMEOUT_MS = 30_000;

/**
 * Upper bound for close(). The SIGTERM handler waits on it, and every step of
 * closing can stall while the brokers are unreachable. Well inside Kubernetes'
 * default 30 s grace period.
 */
const CLOSE_TIMEOUT_MS = 10_000;

/**
 * How often the consumer checks its own health, as a safety net for failures
 * that raise no 'error' or 'close' on the client or stream.
 */
const HEALTH_CHECK_INTERVAL_MS = 15_000;

/**
 * Consecutive unhealthy checks before rebuilding. The client heals some states
 * itself, like rejoining after a rebalance; requiring two gives it at least a full interval.
 */
const UNHEALTHY_CHECKS_BEFORE_RECOVERY = 2;

const KAFKA_BROKERS = requiredEnvString('KAFKA_BROKERS')
  .split(',')
  .map((b) => b.trim())
  .filter((b) => b.length > 0);

if (KAFKA_BROKERS.length === 0) {
  throw new Error('KAFKA_BROKERS must contain at least one broker');
}

const KAFKA_TLS: ConnectionOptions = {
  key: requiredEnvString('KAFKA_PRIVATE_KEY'),
  cert: requiredEnvString('KAFKA_CERTIFICATE'),
  ca: requiredEnvString('KAFKA_CA'),
};

/** Builds a fresh client. Recovery calls this on every rebuild. */
const defaultCreateConsumer = (groupId: string) =>
  new Consumer<string, string, string, string>({
    groupId,
    clientId: 'kabal-frontend',
    bootstrapBrokers: KAFKA_BROKERS,
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
 * The part of a MessagesStream this class uses. Declared rather than derived:
 * MessagesStream is a concrete Readable built around a live Consumer, so it
 * can't be faked. tsc checks that a real one fits where defaultCreateConsumer
 * is the default factory.
 */
export interface DocumentAccessStream {
  readonly closed: boolean;
  close(): Promise<void>;
  removeAllListeners(): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'data', listener: (message: Message<string, string, string, string>) => void): this;
}

/**
 * The part of the Kafka client this class uses. Picked from Consumer to keep
 * the real signatures, except consume() and on(), which are declared against
 * just what this class needs so they can be faked. tsc checks that a real
 * Consumer fits where defaultCreateConsumer is the default factory.
 */
export type DocumentAccessKafkaClient = Pick<
  DocumentAccessConsumer,
  'connectToBrokers' | 'isConnected' | 'isActive' | 'leaveGroup' | 'close' | 'memberId'
> & {
  consume: (options: ConsumeOptions<string, string, string, string>) => Promise<DocumentAccessStream>;
  on: {
    (event: 'error', listener: (error: Error) => void): unknown;
    (event: 'consumer:heartbeat:stalled', listener: (payload: ConsumerHeartbeatStalledPayload) => void): unknown;
  };
};

/** Builds a Kafka client. Injectable for tests. */
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
 * Owns the Kafka consumer lifecycle for document write-access updates: connect,
 * detect failures, recover, report health and close. Each record goes to the
 * injected handler inside a CONSUMER span.
 *
 * Recovery lives here rather than in the caller, so all retry state has one
 * owner and nothing else can race it.
 */
export class DocumentAccessKafkaConsumer implements DocumentAccessKafkaConsumerApi {
  /**
   * Stable for the process, so a rebuilt client rejoins the same group and
   * resumes from its committed offsets.
   */
  readonly #groupId = crypto.randomUUID();

  #consumer: DocumentAccessKafkaClient;

  #stream: DocumentAccessStream | null = null;

  /** True while an attempt is in flight. Keeps overlapping attempts out. */
  #starting = false;

  /** The queued retry, if any. */
  #retryTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Consecutive failures since a stream last stayed up for STABLE_STREAM_MS.
   * Drives the backoff.
   */
  #failures = 0;

  /** Handle of the periodic health check, started by connect(). */
  #healthCheckTimer: ReturnType<typeof setInterval> | null = null;

  /** A retry that came due mid-attempt. Run when the attempt finishes. */
  #retryDeferred = false;

  /** Consecutive health checks that found us degraded with no recovery under way. */
  #unhealthyChecks = 0;

  /**
   * Bumped when an attempt starts or fails. A timed-out attempt keeps running,
   * since Kafka requests can't be cancelled, so it checks this before
   * installing its stream and discards the stream if it has been superseded.
   */
  #generation = 0;

  /** Set by close(), so no queued or in-flight attempt can resurrect us. */
  #closed = false;

  readonly #onMessage: DocumentAccessMessageHandler;
  readonly #trace_id: string;
  readonly #createConsumer: CreateKafkaClient;

  constructor(
    onMessage: DocumentAccessMessageHandler,
    trace_id: string,
    createConsumer: CreateKafkaClient = defaultCreateConsumer,
  ) {
    this.#onMessage = onMessage;
    this.#trace_id = trace_id;
    this.#createConsumer = createConsumer;
    this.#consumer = this.#buildClient();
  }

  /**
   * Starts consuming, then keeps recovering on its own until close(). Never
   * throws: startup must not fail because Kafka is down. Call once.
   */
  connect = async (): Promise<void> => {
    this.#startHealthCheck();

    await this.#start(false);
  };

  /**
   * One attempt at getting to "connected, joined and streaming". `rebuild`
   * replaces the client first: a broker upgrade leaves the old one with stale
   * connections, metadata and group membership, and consume() on it keeps failing.
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
      const started = await withTimeout(
        this.#attempt(rebuild, generation),
        ATTEMPT_TIMEOUT_MS,
        'Kafka consumer start timed out',
      );

      // False means close() got in first.
      if (started) {
        log.info({ msg: 'Kafka consumer stream started', trace_id, data: { group_id: this.#groupId } });
      }
    } catch (error) {
      // Retire this attempt: if it timed out, it is still running and must not
      // install its stream later.
      this.#generation += 1;

      if (this.#closed) {
        log.debug({ msg: 'Kafka consumer attempt interrupted by close', trace_id, error });

        return;
      }

      log.error({ msg: 'Failed to start Kafka consumer, degrading to API fallback', trace_id, error });

      // Anything half-started is dropped by the rebuild on the next attempt.
      this.#scheduleRetry();
    } finally {
      this.#starting = false;

      if (this.#retryDeferred) {
        this.#retryDeferred = false;

        // Unless a failed attempt has queued its own retry, run the deferred
        // one now: its backoff has already passed.
        if (this.#retryTimer === null) {
          void this.#start(true);
        }
      }
    }
  };

  /** Resolves true once a stream is installed, false if closed or superseded meanwhile. */
  #attempt = async (rebuild: boolean, generation: number): Promise<boolean> => {
    const trace_id = this.#trace_id;

    await this.#discardStream();

    // Closing can outlast ATTEMPT_TIMEOUT_MS. If this attempt was abandoned
    // meanwhile, a newer one may own #consumer.
    if (this.#closed || generation !== this.#generation) {
      return false;
    }

    if (rebuild) {
      this.#rebuildClient();
    }

    // Pinned: an abandoned attempt must never touch the client that replaced it.
    const consumer = this.#consumer;

    log.debug({ msg: 'Connecting to Kafka brokers...', trace_id });
    await consumer.connectToBrokers();
    log.debug({ msg: 'Kafka consumer connected to brokers', trace_id });

    // No joinGroup(): on a fresh client, consume() joins by itself with the
    // session settings passed to it. Joining first would use the library's
    // defaults (a 60 s session, not 10 s) and cost a second rebalance.
    return this.#startStream(consumer, generation);
  };

  /**
   * Swaps in a fresh client and disposes of the old one in the background: its
   * close sends LeaveGroup, which can't be relied on while the brokers are gone.
   */
  #rebuildClient = (): void => {
    const previous = this.#consumer;

    this.#consumer = this.#buildClient();

    log.debug({ msg: 'Kafka client rebuilt, discarding the previous one', trace_id: this.#trace_id });

    this.#disposeClient(previous);
  };

  /**
   * Force-closes a discarded client. If LeaveGroup fails, @platformatic/kafka
   * leaves the client half-closed: connection pool open, kafka_consumers gauge
   * not decremented. The library skips LeaveGroup when memberId is null, so
   * clearing it lets a second close free the client. Retrying LeaveGroup would
   * gain nothing: by the time it could get through, the session has timed out.
   */
  #disposeClient = (client: DocumentAccessKafkaClient): void => {
    const trace_id = this.#trace_id;

    // Callback form: with a force flag, the typings return void, not a promise.
    client.close(true, (error) => {
      if (error === null) {
        return;
      }

      log.warn({
        msg: 'Failed to close a discarded Kafka client, closing it without leaving the group',
        trace_id,
        error,
      });

      client.memberId = null;

      client.close(true, (fallbackError) => {
        if (fallbackError !== null) {
          log.warn({ msg: 'Failed to close a discarded Kafka client, abandoning it', trace_id, error: fallbackError });
        }
      });
    });
  };

  /**
   * Every client, discarded ones included, keeps its listeners for life.
   *
   * 'error': emitted when rejoining the group after a failed heartbeat gives up.
   * Unhandled, EventEmitter would throw it into the library's callback, and
   * recovery would wait for the health check.
   *
   * 'consumer:heartbeat:stalled': no heartbeat has succeeded for rebalanceTimeout
   * (102 s by default). Likely a half-open socket to the coordinator: request
   * timeouts don't close it, so the library keeps reusing it. The stream has its
   * own connections and keeps working, so nothing else triggers recovery.
   */
  #buildClient = (): DocumentAccessKafkaClient => {
    const client = this.#createConsumer(this.#groupId);

    client.on('error', (error) => this.#onClientFailure(client, 'Kafka client error', error));
    client.on('consumer:heartbeat:stalled', ({ lastError, stalledFor }) =>
      this.#onClientFailure(client, `Kafka client heartbeat stalled for ${stalledFor} ms`, lastError),
    );

    return client;
  };

  #onClientFailure = (client: DocumentAccessKafkaClient, failure: string, error: unknown): void => {
    const trace_id = this.#trace_id;

    if (this.#closed || client !== this.#consumer) {
      log.warn({ msg: `${failure} (discarded client, ignoring)`, trace_id, error });

      return;
    }

    log.error({ msg: `${failure}, rebuilding it`, trace_id, error });

    // An attempt in flight on this client is left to finish (it's bounded by
    // ATTEMPT_TIMEOUT_MS). The retry queued here replaces whatever it installs.
    // If the retry comes due first, #start() would turn it away, so it's
    // deferred until the attempt is done.
    this.#recover();
  };

  /**
   * Discards the current stream and queues a rebuild, rather than restarting
   * the stream on a client that may be just as broken. The stream is forgotten
   * at once but closed in the background: closing can stall during an outage,
   * and nothing bounds it here.
   */
  #recover = (): void => {
    void this.#discardStream();
    this.#scheduleRetry();
  };

  /**
   * Counts a failure and queues a retry with capped exponential backoff. Only
   * one retry is queued at a time, so several signals of one failure count once.
   */
  #scheduleRetry = (): void => {
    if (this.#closed || this.#retryTimer !== null) {
      return;
    }

    this.#failures += 1;

    const delay = retryDelay(this.#failures);

    log.info({
      msg: `Retrying Kafka consumer in ${delay} ms (consecutive failures: ${this.#failures})`,
      trace_id: this.#trace_id,
    });

    this.#retryTimer = setTimeout(() => {
      this.#retryTimer = null;

      // Mid-attempt, #start() would turn this away (see #onClientFailure).
      if (this.#starting) {
        this.#retryDeferred = true;

        return;
      }

      // Always rebuild: every path that lands here left broken client state behind.
      void this.#start(true);
    }, delay);

    this.#retryTimer.unref();
  };

  #clearRetryTimer = (): void => {
    if (this.#retryTimer === null) {
      return;
    }

    clearTimeout(this.#retryTimer);
    this.#retryTimer = null;
  };

  #startHealthCheck = (): void => {
    if (this.#closed || this.#healthCheckTimer !== null) {
      return;
    }

    this.#healthCheckTimer = setInterval(this.#checkHealth, HEALTH_CHECK_INTERVAL_MS);
    this.#healthCheckTimer.unref();
  };

  #stopHealthCheck = (): void => {
    if (this.#healthCheckTimer === null) {
      return;
    }

    clearInterval(this.#healthCheckTimer);
    this.#healthCheckTimer = null;
  };

  /**
   * Safety net for failures that raise no event: if we're degraded and no
   * recovery is running or queued, rebuild.
   */
  #checkHealth = (): void => {
    // Nothing to do: closed, or a recovery is already running or queued.
    if (this.#closed || this.#starting || this.#retryTimer !== null) {
      this.#unhealthyChecks = 0;

      return;
    }

    const errors = this.getErrors();

    if (errors.length === 0) {
      this.#unhealthyChecks = 0;

      return;
    }

    this.#unhealthyChecks += 1;

    if (this.#unhealthyChecks < UNHEALTHY_CHECKS_BEFORE_RECOVERY) {
      return;
    }

    this.#unhealthyChecks = 0;

    log.warn({
      msg: 'Kafka consumer is unhealthy and no recovery is under way, rebuilding it',
      trace_id: this.#trace_id,
      data: { errors },
    });

    this.#recover();
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

  /**
   * Best-effort: bounded by CLOSE_TIMEOUT_MS and never throws, so shutdown goes
   * on whatever state Kafka is in. A group membership left behind expires with
   * the session timeout.
   */
  close = async (): Promise<void> => {
    const trace_id = this.#trace_id;

    log.debug({ msg: 'Closing Kafka consumer...', trace_id });

    // #closed also keeps an in-flight attempt from installing its stream.
    this.#closed = true;
    this.#clearRetryTimer();
    this.#stopHealthCheck();

    try {
      await withTimeout(this.#shutdown(), CLOSE_TIMEOUT_MS, 'Closing the Kafka consumer timed out');
    } catch (error) {
      log.warn({ msg: 'Kafka consumer did not close cleanly, abandoning it', trace_id, error });
    }
  };

  #shutdown = async (): Promise<void> => {
    const trace_id = this.#trace_id;

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

  /** Forgets the current stream synchronously, then closes it. Never throws. */
  #discardStream = async (): Promise<void> => {
    const stream = this.#stream;

    if (stream === null) {
      return;
    }

    this.#stream = null;

    await closeStream(stream, this.#trace_id);
  };

  /** Resolves true if the stream was installed, false if it was thrown away. */
  #startStream = async (consumer: DocumentAccessKafkaClient, generation: number): Promise<boolean> => {
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
      // Closed or superseded while connecting: don't leave a live stream on a
      // client nobody owns.
      log.debug({ msg: 'Discarding stream from a superseded Kafka consumer attempt', trace_id });

      await closeStream(stream, trace_id);

      return false;
    }

    this.#stream = stream;

    const stableTimer = setTimeout(() => {
      if (this.#stream === stream && this.getErrors().length === 0) {
        this.#failures = 0;
      }
    }, STABLE_STREAM_MS);

    stableTimer.unref();

    stream.on('error', (error) => {
      log.error({ msg: 'Kafka consumer stream error', trace_id, error });

      if (this.#stream !== stream) {
        return; // Already replaced or discarded.
      }

      this.#recover();
    });

    // A stream can also end without an error. 'close' follows every kind of
    // termination, so this catches the silent ones.
    stream.on('close', () => {
      if (this.#stream !== stream) {
        return; // Closed by us, or already handled by the 'error' listener.
      }

      log.warn({ msg: 'Kafka consumer stream closed unexpectedly', trace_id });

      this.#recover();
    });

    log.debug({ msg: 'Kafka consumer stream listener starting...', trace_id });

    stream.on('data', async ({ key: documentId, value, timestamp, headers, commit }) => {
      // A discarded stream keeps its listeners until its close finishes, which
      // can stall. Drop its records rather than process them alongside the
      // replacement: they're never committed, so the replacement redelivers them.
      if (this.#stream !== stream) {
        return;
      }

      let message_trace_id = trace_id;

      try {
        // OTel's HTTP instrumentation doesn't cover Kafka, so take the trace from
        // the traceparent header.
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

    return true;
  };
}

/**
 * Closes a stream and drops its listeners. Never throws: close can fail, and
 * throwing would abort the recovery or shutdown that follows.
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

/** Capped exponential backoff: MIN_RETRY_DELAY_MS after the first failure, doubling up to MAX_RETRY_DELAY_MS. */
const retryDelay = (failures: number): number =>
  Math.min(MIN_RETRY_DELAY_MS * 2 ** Math.max(failures - 1, 0), MAX_RETRY_DELAY_MS);

/** Rejects after `ms` if `promise` hasn't settled. The operation is abandoned, not cancelled. */
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
