import { propagation, ROOT_CONTEXT, SpanKind, SpanStatusCode, trace } from '@opentelemetry/api';
import { Consumer, type MessagesStream } from '@platformatic/kafka';
import client from 'prom-client';
import { requiredEnvString } from '@/config/env-var';
import { SmartDocumentAccessMap } from '@/document-access/access-map';
import { DocumentAccessNotFoundError, getDocumentAccessListFromApi } from '@/document-access/api/document-access-list';
import { parseKafkaMessageValue } from '@/document-access/kafka';
import type { Metadata } from '@/document-access/types';
import { parseTraceparent } from '@/helpers/traceparent';
import { getLogger } from '@/logger';
import { proxyRegister } from '@/prometheus/types';
import { isShuttingDown } from '@/shutdown';
import { tracer } from '@/tracing/tracer';

const log = getLogger('document-write-access-kafka-consumer');

const kafkaBrokers = requiredEnvString('KAFKA_BROKERS')
  .split(',')
  .map((b) => b.trim());

if (kafkaBrokers.length === 0) {
  throw new Error('KAFKA_BROKERS must contain at least one broker');
}

/**
 * How often the sync loop runs to poll active documents while Kafka is unavailable.
 */
const SYNC_INTERVAL_MS = 5_000;

/**
 * Metadata used for background API calls that are not tied to a specific user
 * request (polling active documents while Kafka is down).
 */
const BACKGROUND_METADATA: Metadata = { tab_id: undefined, client_version: 'kabal-frontend-background' };

type HasAccessListener = (hasWriteAccess: boolean) => void;

class SmartDocumentWriteAccess {
  /**
   * Map of document IDs to their access lists.
   * An access list is a list of Nav-ident strings.
   */
  #accessMap = new SmartDocumentAccessMap();

  #hasAccessListeners: Map<string, HasAccessListener[]> = new Map();
  #deletedDocumentListeners: Map<string, (() => void)[]> = new Map();

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
  #lifecycle_trace_id = trace.getActiveSpan()?.spanContext().traceId ?? crypto.randomUUID().replaceAll('-', '');
  #initTimestamp = Date.now();

  /** Health-gated sync loop. Polls active documents while Kafka is down. */
  #syncLoop: NodeJS.Timeout | null = null;

  /** Whether init() has completed. Used by the startup readiness probe. */
  #initialized = false;

  /** Whether a Kafka (re)connect attempt is currently in progress. */
  #kafkaConnecting = false;

  /**
   * Initializes the access list service.
   * 1. Connect a Kafka consumer to receive changes (best-effort).
   * 2. Start the sync loop (polls active documents while Kafka is unavailable).
   *
   * Access data is never pre-seeded. Each document's list is fetched fresh from
   * the API the first time a user connects to it (allowApiFetching=true), then
   * kept current by Kafka push updates or polling while Kafka is down.
   *
   * Startup never fails because of Kafka — the service degrades to API polling.
   */
  async init(): Promise<void> {
    this.#initTimestamp = Date.now();
    const trace_id = this.#lifecycle_trace_id;

    log.debug({ msg: 'Initializing Smart Document Write Access...', trace_id });

    // 1. Connect to Kafka. Failures are logged but do not abort startup.
    await this.#connectKafka();

    // 2. Start the sync loop.
    this.#startSyncLoop();

    this.#initialized = true;
  }

  /**
   * Connects the Kafka consumer and starts the message stream. Best-effort:
   * any failure is logged and swallowed so the service can run on API polling.
   * Also used by the sync loop to reconnect after an initial connection failure.
   * Guards itself with #kafkaConnecting so concurrent calls are no-ops.
   */
  #connectKafka = async (): Promise<void> => {
    if (this.#kafkaConnecting) {
      return;
    }

    this.#kafkaConnecting = true;
    const trace_id = this.#lifecycle_trace_id;

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
      this.#kafkaConnecting = false;
    }
  };

  #startSyncLoop = () => {
    if (this.#syncLoop !== null) {
      return;
    }

    this.#syncLoop = setInterval(() => {
      this.#ensureAccessListsUpdated().catch((error) => {
        log.error({ msg: 'Sync tick failed', trace_id: this.#lifecycle_trace_id, error });
      });
    }, SYNC_INTERVAL_MS);
  };

  #ensureAccessListsUpdated = async (): Promise<void> => {
    if (isShuttingDown()) {
      return;
    }

    if (this.getErrors().length === 0) {
      return; // Kafka is healthy — push updates handle everything.
    }

    // If the consumer never connected (initial connectToBrokers failed), attempt
    // a background reconnect so the service can self-heal without a pod restart.
    if (!this.#consumer.isConnected()) {
      log.info({
        msg: 'Kafka consumer not connected, attempting background reconnect',
        trace_id: this.#lifecycle_trace_id,
      });

      this.#connectKafka().catch((error) => {
        log.error({ msg: 'Background Kafka reconnect failed', trace_id: this.#lifecycle_trace_id, error });
      });
    }

    await this.#pollActiveDocuments();
  };

  /**
   * Polls the API for the currently active (connected) documents while Kafka is
   * unavailable. Bounded to documents users are actually connected to.
   * A 404 means the document was deleted and is handled as such; any other
   * failure keeps the last-known list rather than risk a wrongful deletion.
   */
  #pollActiveDocuments = async (): Promise<void> => {
    const documentIds = this.#getActiveDocumentIds();

    if (documentIds.size === 0) {
      return;
    }

    const trace_id = this.#lifecycle_trace_id;

    log.debug({
      msg: `Polling ${documentIds.size} active documents from API (Kafka unavailable)`,
      trace_id,
    });

    await Promise.all(
      Array.from(documentIds, async (documentId) => {
        try {
          const { navIdents } = await getDocumentAccessListFromApi(documentId, BACKGROUND_METADATA);
          this.#applyAccessUpdate(documentId, navIdents);
        } catch (error) {
          if (error instanceof DocumentAccessNotFoundError) {
            log.info({
              msg: 'Document deleted (400) while polling, removing from access map',
              trace_id,
              data: { document_id: documentId },
            });

            this.#handleDeletion(documentId);

            return;
          }

          log.warn({
            msg: 'Failed to poll document access from API',
            trace_id,
            data: { document_id: documentId },
            error,
          });
        }
      }),
    );
  };

  /**
   * The set of documents that currently have active listeners, i.e. documents a
   * user is connected to. New documents are not tracked until a user connects.
   */
  #getActiveDocumentIds = (): Set<string> => {
    const documentIds = new Set<string>();

    for (const key of this.#hasAccessListeners.keys()) {
      const [documentId] = key.split(':');

      if (documentId !== undefined && documentId.length > 0) {
        documentIds.add(documentId);
      }
    }

    for (const documentId of this.#deletedDocumentListeners.keys()) {
      documentIds.add(documentId);
    }

    return documentIds;
  };

  /**
   * Sets the access list for a document and notifies listeners only when the
   * membership actually changed, to avoid spamming connected clients on every
   * poll tick.
   */
  #applyAccessUpdate = (documentId: string, navIdents: string[]): void => {
    const previous = this.#accessMap.get(documentId);

    this.#accessMap.set(documentId, navIdents);

    if (previous === undefined || !sameMembers(previous, navIdents)) {
      this.#notifyHasAccessListeners(documentId, navIdents);
    }
  };

  /** Removes a document from the map and notifies access + deletion listeners. */
  #handleDeletion = (documentId: string): void => {
    this.#accessMap.delete(documentId);
    this.#notifyHasAccessListeners(documentId, null);
    this.#notifyDeletedDocumentListeners(documentId);
  };

  #startConsumer = async (restartCount: number) => {
    const trace_id = this.#lifecycle_trace_id;

    log.debug({ msg: `Kafka consumer starting stream #${restartCount}...`, trace_id });

    const stream = await this.#consumer.consume({
      autocommit: false,
      topics: ['klage.smart-document-write-access.v1'],
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
      // Extract trace_id from Kafka message headers for log correlation.
      // Kafka messages are not covered by OTel HTTP instrumentation, so we parse manually.
      const traceparentHeader = headers.get('traceparent');
      const message_trace_id =
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
            'messaging.destination.name': 'klage.smart-document-write-access.v1',
          },
        },
        parentContext,
        async (span) => {
          try {
            await this.#processMessage(documentId, value, timestamp, commit, message_trace_id);
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
    });

    log.debug({ msg: 'Kafka consumer stream listener started', trace_id });

    return stream;
  };

  #processMessage = async (
    documentId: string,
    value: string | undefined,
    timestamp: bigint,
    commit: () => void | Promise<void>,
    message_trace_id: string,
  ): Promise<void> => {
    const payload = value === undefined ? null : parseKafkaMessageValue(value);

    if (payload === null) {
      log.debug({
        msg: 'Received tombstone message from Kafka, deleting access list entry',
        trace_id: message_trace_id,
        data: { key: documentId },
      });

      this.#handleDeletion(documentId);

      try {
        await commit();
      } catch (error) {
        log.error({
          msg: 'Failed to commit tombstone message offset',
          trace_id: message_trace_id,
          data: { key: documentId },
          error,
        });
      }

      return;
    }

    if (timestamp < this.#initTimestamp && this.#accessMap.has(documentId)) {
      try {
        await commit();
      } catch (error) {
        log.error({
          msg: 'Failed to commit outdated message offset',
          trace_id: message_trace_id,
          data: { key: documentId, payload },
          error,
        });
      }

      log.debug({
        msg: 'Received outdated message from Kafka',
        trace_id: message_trace_id,
        data: { key: documentId, payload },
      });

      return;
    }

    log.debug({
      msg: 'Received update message from Kafka',
      trace_id: message_trace_id,
      data: { key: documentId, payload },
    });

    this.#accessMap.set(documentId, payload);
    this.#notifyHasAccessListeners(documentId, payload);

    try {
      await commit();
    } catch (error) {
      log.error({
        msg: 'Failed to commit message offset',
        trace_id: message_trace_id,
        data: { key: documentId, payload },
        error,
      });
    }
  };

  hasAccess = async (
    documentId: string,
    navIdent: string,
    metadata: Metadata,
    allowApiFetching = false,
  ): Promise<boolean> => {
    const { tab_id, client_version, behandling_id } = metadata;

    // Serve from the in-memory map when we have it. The map is kept fresh by
    // Kafka when healthy, and by the API sync loop while Kafka is down.
    const fromAccessMap = this.#accessMap.get(documentId);

    if (fromAccessMap !== undefined) {
      return fromAccessMap.includes(navIdent);
    }

    // The document is not in the map. Only fall back to the API when the caller
    // explicitly allows it (e.g. a user connecting). Background and listener
    // checks rely on the map being populated by Kafka or the sync loop.
    if (allowApiFetching) {
      try {
        const fromApi = await this.#updateAccessListFromApi(documentId, metadata);

        return fromApi.navIdents.includes(navIdent);
      } catch (error) {
        if (error instanceof DocumentAccessNotFoundError) {
          log.info({
            msg: 'Document deleted (400) on access check, removing from access map',
            trace_id: this.#lifecycle_trace_id,
            data: { document_id: documentId },
          });

          this.#handleDeletion(documentId);

          return false;
        }

        log.error({
          msg: 'Failed to resolve document access from API fallback',
          tab_id,
          client_version,
          data: { behandling_id, document_id: documentId, nav_ident: navIdent },
          error,
        });

        return false;
      }
    }

    return false;
  };

  addHasAccessListener = (documentId: string, navIdent: string, metadata: Metadata, listener: HasAccessListener) => {
    // Immediately check access and call the listener with the result.
    this.hasAccess(documentId, navIdent, metadata, false).then(listener);

    const key = `${documentId}:${navIdent}`;

    // Get existing document listeners.
    const listeners = this.#hasAccessListeners.get(key);

    if (listeners === undefined) {
      // If there are no entry for this key, create a new entry.
      this.#hasAccessListeners.set(key, [listener]);

      return () => this.removeHasAccessListener(documentId, navIdent, listener);
    }

    // If there are existing listeners for this key, add the new listener to the array.
    listeners.push(listener);

    return () => this.removeHasAccessListener(documentId, navIdent, listener);
  };

  removeHasAccessListener = (documentId: string, navIdent: string, listener: HasAccessListener) => {
    const key = `${documentId}:${navIdent}`;
    const listeners = this.#hasAccessListeners.get(key);

    if (listeners === undefined) {
      return;
    }

    this.#hasAccessListeners.set(
      key,
      listeners.filter((l) => l !== listener),
    );
  };

  #notifyHasAccessListeners = (documentId: string, navIdents: string[] | null) => {
    const listenerLists = this.#hasAccessListeners.entries().filter(([key]) => key.startsWith(`${documentId}:`));

    for (const [key, listeners] of listenerLists) {
      const [, navIdent] = key.split(':');

      if (navIdent === undefined) {
        continue;
      }

      for (const listener of listeners) {
        listener(navIdents?.includes(navIdent) ?? false);
      }
    }
  };

  addDeletedDocumentListener = (documentId: string, listener: () => void) => {
    const listeners = this.#deletedDocumentListeners.get(documentId) ?? [];
    listeners.push(listener);
    this.#deletedDocumentListeners.set(documentId, listeners);

    return () => this.removeDeletedDocumentListener(documentId, listener);
  };

  removeDeletedDocumentListener = (documentId: string, listener: () => void) => {
    const listeners = this.#deletedDocumentListeners.get(documentId);

    if (listeners === undefined) {
      return;
    }

    this.#deletedDocumentListeners.set(
      documentId,
      listeners.filter((l) => l !== listener),
    );
  };

  removeDeletedDocumentListeners = (documentId: string) => this.#deletedDocumentListeners.delete(documentId);

  #notifyDeletedDocumentListeners = (documentId: string) => {
    const listeners = this.#deletedDocumentListeners.get(documentId);

    if (listeners === undefined) {
      return;
    }

    for (const listener of listeners) {
      listener();
    }

    // Remove all listeners after notifying. A document can only be deleted once.
    this.removeDeletedDocumentListeners(documentId);
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

  /** Whether init() has completed. Used by the startup readiness probe. */
  isReady = (): boolean => this.#initialized;

  close = async () => {
    const trace_id = this.#lifecycle_trace_id;

    if (this.#syncLoop !== null) {
      clearInterval(this.#syncLoop);
      this.#syncLoop = null;
      log.debug({ msg: 'Sync loop stopped', trace_id });
    }

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

  #updateAccessListFromApi = async (documentId: string, metadata: Metadata) => {
    const accessList = await getDocumentAccessListFromApi(documentId, metadata);

    this.#applyAccessUpdate(documentId, accessList.navIdents);

    return accessList;
  };
}

const closeStream = async (stream: MessagesStream<string, string, string, string>, trace_id: string) => {
  log.debug({ msg: 'Closing Kafka consumer stream...', trace_id });
  await stream.close();
  stream.removeAllListeners();
  log.debug({ msg: 'Kafka consumer stream closed', trace_id });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Compares two Nav-ident lists by membership, ignoring order and duplicates. */
const sameMembers = (a: string[], b: string[]): boolean => {
  const setA = new Set(a);
  const setB = new Set(b);

  if (setA.size !== setB.size) {
    return false;
  }

  for (const value of setA) {
    if (!setB.has(value)) {
      return false;
    }
  }

  return true;
};

export const SMART_DOCUMENT_WRITE_ACCESS = new SmartDocumentWriteAccess();
