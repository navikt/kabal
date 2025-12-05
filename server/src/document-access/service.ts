import { requiredEnvString } from '@app/config/env-var';
import { SmartDocumentAccessMap } from '@app/document-access/access-map';
import { getAccessListFromApi } from '@app/document-access/api/access-list';
import { parseKafkaMessageValue } from '@app/document-access/kafka';
import type { Metadata } from '@app/document-access/types';
import { generateTraceId, getTraceIdAndSpanIdFromTraceparent } from '@app/helpers/traceparent';
import { getLogger } from '@app/logger';
import { proxyRegister } from '@app/prometheus/types';
import { Consumer, type MessagesStream } from '@platformatic/kafka';
import client from 'prom-client';

const log = getLogger('document-write-access-kafka-consumer');

const kafkaBrokers = requiredEnvString('KAFKA_BROKERS')
  .split(',')
  .map((b) => b.trim());

if (kafkaBrokers.length === 0) {
  throw new Error('KAFKA_BROKERS must contain at least one broker');
}

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
  #lifecycle_trace_id = generateTraceId();
  #initTimestamp = Date.now();

  /**
   * Initializes the access list service.
   * 1. Sync initial state from API.
   * 2. Create a Kafka consumer to listen for future changes.
   */
  async init(): Promise<void> {
    this.#initTimestamp = Date.now();
    const trace_id = this.#lifecycle_trace_id;

    log.debug({ msg: 'Initializing Smart Document Write Access...', trace_id });

    try {
      log.debug({ msg: 'Connecting to Kafka brokers...', trace_id });
      await this.#consumer.connectToBrokers();
      log.debug({ msg: 'Kafka consumer connected to brokers', trace_id });

      log.debug({ msg: 'Kafka consumer joining group...', trace_id });
      const groupId = await this.#consumer.joinGroup({});
      log.debug({ msg: `Kafka consumer joined group ${groupId}`, trace_id, data: { group_id: groupId } });

      // Create a consumer stream to listen for future changes.
      const initialStream = await this.#startConsumer(0);

      log.info({ msg: 'Kafka consumer stream started', trace_id });

      const readyPromise = new Promise<void>((resolve) => {
        initialStream.once('readable', () => {
          log.debug({ msg: 'Kafka stream readable', trace_id });
          resolve();
        });
      });

      return readyPromise;
    } catch (error) {
      log.error({ msg: 'Failed to initialize Smart Document Write Access', error });

      throw error;
    }
  }

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

      await closeStream(stream, trace_id); // Close the old stream
      await delay(5_000 * restartCount);
      await this.#startConsumer(restartCount + 1); // Start a new stream
      log.debug({ msg: 'Kafka consumer stream restarted', trace_id });
    });

    log.debug({ msg: 'Kafka consumer stream listener starting...', trace_id });

    stream.on('data', async ({ key: documentId, value, timestamp, headers, commit }) => {
      const traceparent = headers.get('traceparent');

      const message_trace_id =
        traceparent === undefined ? undefined : getTraceIdAndSpanIdFromTraceparent(traceparent)?.trace_id;

      const payload = parseKafkaMessageValue(value, message_trace_id ?? trace_id);

      if (payload === null) {
        log.debug({
          msg: 'Received tombstone message from Kafka, deleting access list entry',
          trace_id: message_trace_id ?? trace_id,
          data: { key: documentId },
        });

        this.#accessMap.delete(documentId);
        this.#notifyHasAccessListeners(documentId, null);
        this.#notifyDeletedDocumentListeners(documentId);

        try {
          await commit();
        } catch (error) {
          log.error({
            msg: 'Failed to commit tombstone message offset',
            trace_id: message_trace_id ?? trace_id,
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
            trace_id: message_trace_id ?? trace_id,
            data: { key: documentId, payload },
            error,
          });
        }

        return log.debug({
          msg: 'Received outdated message from Kafka',
          trace_id: message_trace_id ?? trace_id,
          data: { key: documentId, payload },
        });
      }

      log.debug({
        msg: 'Received update message from Kafka',
        trace_id: message_trace_id ?? trace_id,
        data: { key: documentId, payload },
      });

      this.#accessMap.set(documentId, payload);
      this.#notifyHasAccessListeners(documentId, payload);

      try {
        await commit();
      } catch (error) {
        log.error({
          msg: 'Failed to commit message offset',
          trace_id: message_trace_id ?? trace_id,
          data: { key: documentId, payload },
          error,
        });
      }
    });

    log.debug({ msg: 'Kafka consumer stream listener started', trace_id });

    return stream;
  };

  hasAccess = async (
    documentId: string,
    navIdent: string,
    metadata: Metadata,
    allowApiFetching = false,
  ): Promise<boolean> => {
    const { trace_id, span_id, tab_id, client_version, behandling_id } = metadata;

    if (!this.isProcessing()) {
      // If the consumer is not processing messages, we cannot be sure the access is up to date.
      log.error({
        msg: 'Smart Document Write Access is not processing Kafka messages.',
        trace_id,
        span_id,
        tab_id,
        client_version,
        data: { behandling_id, document_id: documentId, nav_ident: navIdent, allow_api_fetching: allowApiFetching },
      });

      return false;
    }

    const fromAccessMap = this.#accessMap.get(documentId);

    if (fromAccessMap !== undefined) {
      return fromAccessMap.includes(navIdent);
    }

    if (allowApiFetching) {
      const fromApi = await this.#updateAccessListFromApi(documentId, metadata);

      return fromApi.navIdents.includes(navIdent);
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

  isProcessing = () => {
    const trace_id = this.#lifecycle_trace_id;

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

    if (errors.length === 0) {
      // If there are no errors, we are processing.
      return true;
    }

    log.warn({
      msg: `Smart Document Write Access is not processing - ${errors.join(', ')}`,
      trace_id,
      data: { errors, trace_id },
    });

    return false;
  };

  close = async () => {
    const trace_id = this.#lifecycle_trace_id;

    log.debug({ msg: 'Closing Kafka consumer...', trace_id });

    if (this.#stream === null) {
      log.debug({ msg: 'Kafka consumer stream not initialized, nothing to close', trace_id });
    } else {
      await closeStream(this.#stream, trace_id);
    }

    log.debug({ msg: 'Kafka consumer leaving group...', trace_id });
    await this.#consumer.leaveGroup();
    log.debug({ msg: 'Kafka consumer left group', trace_id });

    log.debug({ msg: 'Kafka consumer closing...', trace_id });
    await this.#consumer.close();
    log.debug({ msg: 'Kafka consumer closed', trace_id });
  };

  #updateAccessListFromApi = async (documentId: string, metadata: Metadata) => {
    const accessList = await getAccessListFromApi(documentId, metadata);

    this.#accessMap.set(documentId, accessList.navIdents);

    return accessList;
  };
}

const closeStream = async (stream: MessagesStream<string, string, string, string>, trace_id: string) => {
  log.debug({ msg: 'Closing Kafka consumer stream...', trace_id });
  stream.removeAllListeners();
  await stream.close();
  log.debug({ msg: 'Kafka consumer stream closed', trace_id });
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const SMART_DOCUMENT_WRITE_ACCESS = new SmartDocumentWriteAccess();
