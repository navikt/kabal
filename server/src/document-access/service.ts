import { trace } from '@opentelemetry/api';
import { SmartDocumentAccessMap } from '@/document-access/access-map';
import { DocumentAccessNotFoundError, getDocumentAccessListFromApi } from '@/document-access/api/document-access-list';
import { parseKafkaMessageValue } from '@/document-access/kafka';
import {
  DocumentAccessKafkaConsumer,
  type DocumentAccessKafkaConsumerApi,
  type DocumentAccessMessage,
  type DocumentAccessMessageHandler,
} from '@/document-access/kafka-consumer';
import { ListenerMap } from '@/document-access/listener-map';
import type { Metadata } from '@/document-access/types';
import { IntervalLoop } from '@/helpers/interval-loop';
import { sameMembers } from '@/helpers/same-members';
import { getLogger } from '@/logger';
import { isShuttingDown } from '@/shutdown';

const log = getLogger('document-write-access-kafka-consumer');

/**
 * How often the sync loop runs to poll active documents while Kafka is unavailable.
 */
export const SYNC_INTERVAL_MS = 5_000;

/**
 * Metadata used for background API calls that are not tied to a specific user
 * request (polling active documents while Kafka is down).
 */
const BACKGROUND_METADATA: Metadata = { tab_id: undefined, client_version: 'kabal-frontend-background' };

type HasAccessListener = (hasWriteAccess: boolean) => void;
type DeletedDocumentListener = () => void;

type FetchAccessList = typeof getDocumentAccessListFromApi;
type CreateKafkaConsumer = (onMessage: DocumentAccessMessageHandler, traceId: string) => DocumentAccessKafkaConsumerApi;

export class SmartDocumentWriteAccess {
  /**
   * Map of document IDs to their access lists.
   * An access list is a list of Nav-ident strings.
   */
  #accessMap = new SmartDocumentAccessMap();

  #hasAccessListeners = new ListenerMap<HasAccessListener>();
  #deletedDocumentListeners = new ListenerMap<DeletedDocumentListener>();

  #lifecycle_trace_id = trace.getActiveSpan()?.spanContext().traceId ?? crypto.randomUUID().replaceAll('-', '');
  #initTimestamp: bigint = BigInt(Date.now());

  /** Owns the Kafka consumer lifecycle and feeds records to #processMessage. */
  readonly #kafka: DocumentAccessKafkaConsumerApi;

  /** Fetches a document's access list from kabal-api. */
  readonly #fetchAccessList: FetchAccessList;

  /** Health-gated sync loop. Polls active documents while Kafka is down. */
  #syncLoop = new IntervalLoop(SYNC_INTERVAL_MS, (error) =>
    log.error({ msg: 'Sync tick failed', trace_id: this.#lifecycle_trace_id, error }),
  );

  /** Whether init() has completed. Used by the startup readiness probe. */
  #initialized = false;

  constructor(
    createKafkaConsumer: CreateKafkaConsumer = (onMessage, traceId) =>
      new DocumentAccessKafkaConsumer(onMessage, traceId),
    fetchAccessList: FetchAccessList = getDocumentAccessListFromApi,
  ) {
    this.#fetchAccessList = fetchAccessList;
    this.#kafka = createKafkaConsumer((message) => this.#processMessage(message), this.#lifecycle_trace_id);
  }

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
    this.#initTimestamp = BigInt(Date.now());
    const trace_id = this.#lifecycle_trace_id;

    log.debug({ msg: 'Initializing Smart Document Write Access...', trace_id });

    // 1. Connect to Kafka. Failures are logged but do not abort startup.
    await this.#kafka.connect();

    // 2. Start the sync loop.
    this.#syncLoop.start(this.#ensureAccessListsUpdated);

    this.#initialized = true;
  }

  #ensureAccessListsUpdated = async (): Promise<void> => {
    if (isShuttingDown()) {
      return;
    }

    if (this.#kafka.getErrors().length === 0) {
      return; // Kafka is healthy — push updates handle everything.
    }

    // If the consumer never connected (initial connectToBrokers failed), attempt
    // a background reconnect so the service can self-heal without a pod restart.
    if (!this.#kafka.isConnected()) {
      log.info({
        msg: 'Kafka consumer not connected, attempting background reconnect',
        trace_id: this.#lifecycle_trace_id,
      });

      this.#kafka.connect().catch((error) => {
        log.error({ msg: 'Background Kafka reconnect failed', trace_id: this.#lifecycle_trace_id, error });
      });
    }

    await this.#pollActiveDocuments();
  };

  /** Polls the API for documents with active connections while Kafka is unavailable. */
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
          const { navIdents } = await this.#fetchAccessList(documentId, BACKGROUND_METADATA);
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
   * The set of documents with at least one active connection, derived from the
   * access and deletion listeners. Polling is bounded to documents a user is
   * currently connected to, so it cannot grow with the Kafka-mirrored cache.
   * Deleted documents are excluded because #handleDeletion removes their
   * listeners.
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
    this.#removeHasAccessListenersForDocument(documentId);
  };

  /** Drops all has-access listeners for a document, e.g. after deletion. */
  #removeHasAccessListenersForDocument = (documentId: string): void => {
    for (const key of this.#hasAccessListeners.keys()) {
      if (key.startsWith(documentId)) {
        this.#hasAccessListeners.delete(key);
      }
    }
  };

  #processMessage = async ({
    documentId,
    value,
    timestamp,
    commit,
    trace_id: message_trace_id,
  }: DocumentAccessMessage): Promise<void> => {
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

    return this.#hasAccessListeners.add(`${documentId}:${navIdent}`, listener);
  };

  #notifyHasAccessListeners = (documentId: string, navIdents: string[] | null) => {
    const listenerLists = this.#hasAccessListeners.entries().filter(([key]) => key.startsWith(documentId));

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

  addDeletedDocumentListener = (documentId: string, listener: DeletedDocumentListener) =>
    this.#deletedDocumentListeners.add(documentId, listener);

  #notifyDeletedDocumentListeners = (documentId: string) => {
    const listeners = this.#deletedDocumentListeners.get(documentId);

    if (listeners === undefined) {
      return;
    }

    for (const listener of listeners) {
      listener();
    }

    // Remove all listeners after notifying. A document can only be deleted once.
    this.#deletedDocumentListeners.delete(documentId);
  };

  getErrors = (): string[] => this.#kafka.getErrors();

  /** Whether init() has completed. Used by the startup readiness probe. */
  isReady = (): boolean => this.#initialized;

  close = async () => {
    const trace_id = this.#lifecycle_trace_id;

    if (this.#syncLoop.isRunning) {
      this.#syncLoop.stop();
      log.debug({ msg: 'Sync loop stopped', trace_id });
    }

    await this.#kafka.close();
  };

  #updateAccessListFromApi = async (documentId: string, metadata: Metadata) => {
    const accessList = await this.#fetchAccessList(documentId, metadata);

    this.#applyAccessUpdate(documentId, accessList.navIdents);

    return accessList;
  };
}

export const SMART_DOCUMENT_WRITE_ACCESS = new SmartDocumentWriteAccess();
