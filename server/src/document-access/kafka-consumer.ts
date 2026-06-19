import { propagation, ROOT_CONTEXT, SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { Consumer, type MessagesStream } from '@platformatic/kafka';
import client from 'prom-client';
import { requiredEnvString } from '@/config/env-var';
import { parseTraceparent } from '@/helpers/traceparent';
import { getLogger } from '@/logger';
import { proxyRegister } from '@/prometheus/types';
import { tracer } from '@/tracing/tracer';

const log = getLogger('document-write-access-kafka-consumer');

const TOPIC = 'klage.smart-document-write-access.v1';

const kafkaBrokers = requiredEnvString('KAFKA_BROKERS')
  .split(',')
  .map((b) => b.trim())
  .filter((b) => b.length > 0);

if (kafkaBrokers.length === 0) {
  throw new Error('KAFKA_BROKERS must contain at least one broker');
}

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
  isConnected: () => boolean;
  getErrors: () => string[];
  close: () => Promise<void>;
}

/**
 * Owns the Kafka consumer lifecycle for document write-access updates: connect,
 * (re)start the stream, surface health, and close. Each record is handed to the
 * injected handler inside a CONSUMER span; how a record mutates access state is
 * the caller's concern. Best-effort throughout — connection failures are logged
 * and swallowed so the service can degrade to API polling.
 */
export class DocumentAccessKafkaConsumer implements DocumentAccessKafkaConsumerApi {
  #consumer = new Consumer({
    groupId: crypto.randomUUID(),
    clientId: 'kabal-frontend',
    bootstrapBrokers: kafkaBrokers,
    tls: {
      key: requiredEnvString('KAFKA_PRIVATE_KEY'),
      cert: requiredEnvString('KAFKA_CERTIFICATE'),
      ca: requiredEnvString('KAFKA_CA'),
    },
    metrics: { registry: proxyRegister, client },
    deserializers: {
      key: (data) => data?.toString('utf-8'),
      value: (data) => data?.toString('utf-8'),
      headerKey: (data) => data?.toString('utf-8'),
      headerValue: (data) => data?.toString('utf-8'),
    },
  });

  #stream: MessagesStream<string, string, string, string> | null = null;
  #connecting = false;

  readonly #onMessage: DocumentAccessMessageHandler;
  readonly #trace_id: string;

  constructor(onMessage: DocumentAccessMessageHandler, trace_id: string) {
    this.#onMessage = onMessage;
    this.#trace_id = trace_id;
  }

  /**
   * Connects the consumer and starts the message stream. Guards itself with
   * #connecting so concurrent calls (e.g. the sync loop's background reconnect)
   * are no-ops. Any failure is logged and swallowed.
   */
  connect = async (): Promise<void> => {
    if (this.#connecting) {
      return;
    }

    this.#connecting = true;
    const trace_id = this.#trace_id;

    try {
      log.debug({ msg: 'Connecting to Kafka brokers...', trace_id });
      await this.#consumer.connectToBrokers();
      log.debug({ msg: 'Kafka consumer connected to brokers', trace_id });

      log.debug({ msg: 'Kafka consumer joining group...', trace_id });
      const groupId = await this.#consumer.joinGroup({});
      log.debug({ msg: `Kafka consumer joined group ${groupId}`, trace_id, data: { group_id: groupId } });

      await this.#startConsumer(0);

      log.info({ msg: 'Kafka consumer stream started', trace_id });
    } catch (error) {
      log.error({
        msg: 'Failed to connect Kafka consumer, continuing with API fallback',
        trace_id,
        error,
      });
    } finally {
      this.#connecting = false;
    }
  };

  isConnected = (): boolean => this.#consumer.isConnected();

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

    if (this.#stream === null) {
      log.debug({ msg: 'Kafka consumer stream not initialized, nothing to close', trace_id });
    } else {
      await closeStream(this.#stream, trace_id);
    }

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

  #startConsumer = async (restartCount: number): Promise<MessagesStream<string, string, string, string>> => {
    const trace_id = this.#trace_id;

    log.debug({ msg: `Kafka consumer starting stream #${restartCount}...`, trace_id });

    const stream = await this.#consumer.consume({
      autocommit: false,
      topics: [TOPIC],
      sessionTimeout: 10_000,
      heartbeatInterval: 500,
      mode: 'committed',
    });

    this.#stream = stream;

    stream.on('error', async (err) => {
      log.error({
        msg: `Kafka consumer stream error, restarting consumer (${restartCount + 1})...`,
        trace_id,
        error: err,
      });

      try {
        await closeStream(stream, trace_id); // Close the old stream
        await delay(5_000 * restartCount);
        await this.#startConsumer(restartCount + 1); // Start a new stream
        log.info({ msg: 'Kafka consumer stream restarted', trace_id });
      } catch (error) {
        log.error({ msg: 'Failed to restart Kafka consumer stream.', trace_id, error: error });
      }
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

    return stream;
  };
}

const closeStream = async (stream: MessagesStream<string, string, string, string>, trace_id: string) => {
  log.debug({ msg: 'Closing Kafka consumer stream...', trace_id });
  await stream.close();
  stream.removeAllListeners();
  log.debug({ msg: 'Kafka consumer stream closed', trace_id });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
