import { setTimeout } from 'node:timers/promises';
import {
  HIGHLIGHT_SERVER_EVENT_NAMES,
  type HighlightServerEventData,
  type HighlightServerEventName,
} from '@navikt/klage-file-viewer/highlight-storage';
import {
  applyHighlightChanges,
  type HighlightChanges,
  type MarkerHighlight,
  type MarkerHighlightSource,
  validateHighlightChanges,
  validateHighlights,
} from '@navikt/klage-file-viewer/highlights';
import { context, propagation } from '@opentelemetry/api';
import { createClientPool, type RedisClientPoolType, WatchError } from 'redis';
import { getHighlightsId } from '#shared/highlights';
import { ListenerMap } from '@/helpers/listener-map';
import { getLogger } from '@/logger';
import { type HighlightBehandling, type HighlightDocument, isHighlightFormat } from '@/plugins/highlights/types';
import type { ValkeyOptions } from '@/valkey/types';
import { createValkeyClient } from '@/valkey/valkey-client';

const log = getLogger('highlights-repository');

/** An event for the user's viewers. See `HighlightServerEventData` in `@navikt/klage-file-viewer/highlight-storage`. */
export interface HighlightServerEvent {
  name: HighlightServerEventName;
  /** JSON-encoded. */
  data: string;
}

export type HighlightEventSender = (event: HighlightServerEvent) => void;

export interface HighlightRepository {
  /** Applies the changes atomically, tells the user's viewers on every pod, and returns the applied changes. */
  save: (document: HighlightDocument, changes: unknown) => Promise<SavedChanges>;
  /**
   * Sends `snapshot` with the user's highlights in the behandling, then the changes since, or only `closed`.
   * Sends nothing after `closed`. Calls `onError` when events can no longer be sent, and the client must reconnect.
   * Returns an unsubscribe function.
   */
  subscribe: (
    behandling: HighlightBehandling,
    send: HighlightEventSender,
    onError: (error: unknown) => void,
  ) => () => void;
  /**
   * Highlights contain document text, so they are deleted for all users when the behandling is finished.
   * Later saves are rejected, and viewers get `closed`. Safe to repeat.
   */
  deleteBehandling: (behandlingId: string) => Promise<void>;
  /** Reads all stored highlights and finished markers. Slow, only for metrics. Rejects when `signal` aborts. */
  scan: (signal?: AbortSignal) => Promise<HighlightScan>;
  close: () => Promise<void>;
}

export interface SavedChanges {
  applied: HighlightChanges;
  /** Stored highlights removed because a new highlight covers them. */
  coveredCount: number;
}

/** What the metrics need from a highlight. Leaves out the text and rectangles, so a scan doesn't hold them. */
export interface HighlightSummary {
  source: MarkerHighlightSource;
  textLength: number;
  createdAt: number;
}

/** One user's stored highlights in one document variant. */
export interface HighlightEntry extends HighlightDocument {
  /** Empty when every highlight is removed and only the removed IDs are left. */
  highlights: HighlightSummary[];
}

export interface HighlightScan {
  entries: HighlightEntry[];
  /** Behandlinger marked as finished. */
  finishedMarkerCount: number;
}

/** Thrown when saving highlights for a finished behandling. */
export class BehandlingFinishedError extends Error {}

/** Rejects saves from stale viewers for a while after the behandling is finished. */
const FINISHED_TTL_SECONDS = 365 * 24 * 60 * 60;
/** Removed IDs are kept so retried saves can't add them again. Unsaved changes are rarely saved again later than this. */
const REMOVED_TTL_MS = 7 * 24 * 60 * 60 * 1_000;
const MAX_SAVE_ATTEMPTS = 5;

/** For local development and tests. Not shared between pods. */
export const createMemoryHighlightRepository = (): HighlightRepository => {
  /** Mirrors the Valkey hashes: behandling ID to field to stored document. */
  const behandlinger = new Map<string, Map<string, string>>();
  const finished = new Set<string>();
  const listeners = new ListenerMap<(message: EventMessage) => void>();

  const publish = (behandlingId: string, message: EventMessage) => {
    for (const listener of listeners.get(behandlingId) ?? []) {
      listener(message);
    }
  };

  return {
    save: async (document, changes) => {
      if (finished.has(document.behandlingId)) {
        throw new BehandlingFinishedError();
      }

      const fields = behandlinger.get(document.behandlingId) ?? new Map<string, string>();
      const field = getField(document);
      const { value, ...saved } = apply(fields.get(field) ?? null, changes, Date.now());
      behandlinger.set(document.behandlingId, fields.set(field, value));

      for (const message of getChangeMessages(document, saved.applied)) {
        publish(document.behandlingId, message);
      }

      return saved;
    },
    subscribe: (behandling, send) => {
      const fields = behandlinger.get(behandling.behandlingId) ?? new Map<string, string>();
      const first = finished.has(behandling.behandlingId) ? getClosedEvent() : getSnapshotEvent(behandling, fields);
      const sender = createSender(send);
      sender.send(first);

      return listeners.add(behandling.behandlingId, (message) => sender.send(getEventFor(message, behandling)));
    },
    deleteBehandling: async (behandlingId) => {
      finished.add(behandlingId);
      behandlinger.delete(behandlingId);
      publish(behandlingId, getClosedMessage());
    },
    scan: async (signal) => {
      signal?.throwIfAborted();

      return {
        entries: Array.from(behandlinger, ([behandlingId, fields]) => getEntries(behandlingId, fields)).flat(),
        finishedMarkerCount: finished.size,
      };
    },
    close: async () => undefined,
  };
};

/**
 * Each behandling has one hash with every user's highlights, and one Pub/Sub channel. Saves are atomic per document
 * with optimistic locking, and publish the applied changes in the same transaction, so events are delivered
 * even if the pod that saved dies.
 *
 * Each pod has one subscriber connection for all its viewers. Pub/Sub drops messages while the connection is down,
 * so its viewers are told to reconnect, and get a new snapshot.
 */
export const createValkeyHighlightRepository = (options: ValkeyOptions): HighlightRepository => {
  const pool = createClientPool({ ...options, pingInterval: 30_000 }, { minimum: 1, maximum: 10 });

  pool.on('error', (error) => log.error({ msg: 'Valkey pool error', error }));

  const ready = pool.connect();

  ready.catch((error) => log.error({ msg: 'Failed to connect to Valkey', error }));

  const subscriber = createValkeyClient(options);
  const failSubscriptions = new Set<(error: unknown) => void>();

  subscriber.on('error', (error) => {
    for (const fail of failSubscriptions) {
      fail(error);
    }
  });

  const subscriberReady = subscriber.connect();

  subscriberReady.catch((error) => log.error({ msg: 'Failed to connect the Valkey subscriber', error }));

  const readFirstEvent = async (behandling: HighlightBehandling): Promise<HighlightServerEvent> => {
    await ready;

    const [isFinished, fields] = await pool
      .multi()
      .exists(getFinishedKey(behandling.behandlingId))
      .hGetAll(getKey(behandling.behandlingId))
      .execTyped();

    return isFinished === 1 ? getClosedEvent() : getSnapshotEvent(behandling, new Map(Object.entries(fields)));
  };

  return {
    save: async (document, changes) => {
      await ready;

      return pool.execute((client) => saveWithRetry(client, document, changes, 1));
    },
    subscribe: (behandling, send, onError) => {
      const channel = getChannel(behandling.behandlingId);
      const sender = createSender(send);

      const fail = (error: unknown) => {
        if (sender.isStopped()) {
          return;
        }

        sender.stop();
        failSubscriptions.delete(fail);
        onError(error);
      };

      // Changes are sent after the snapshot, in order. Changes the snapshot already has are harmless to repeat.
      const listener = (message: string) => {
        const event = parseEventMessage(message, behandling);

        if (event !== null) {
          firstSent.then(() => sender.send(event), noop);
        }
      };

      // Read once the subscription is active, so no change after the snapshot is missed.
      const subscribed = subscriberReady.then(() => subscriber.subscribe(channel, listener));
      const firstSent = subscribed.then(() => readFirstEvent(behandling)).then(sender.send);

      failSubscriptions.add(fail);
      firstSent.catch(fail);

      return () => {
        sender.stop();
        failSubscriptions.delete(fail);

        // After the subscription is active, so a subscription that is still pending is not left behind.
        subscribed
          .then(() => (subscriber.isOpen ? subscriber.unsubscribe(channel, listener) : undefined))
          .catch((error) => log.warn({ msg: 'Failed to unsubscribe from highlight events', error }));
      };
    },
    deleteBehandling: async (behandlingId) => {
      await ready;

      // Saves watch the marker, and snapshots are read in a transaction, so they see either everything or nothing of this.
      await pool
        .multi()
        .set(getFinishedKey(behandlingId), '1', { expiration: { type: 'EX', value: FINISHED_TTL_SECONDS } })
        .del(getKey(behandlingId))
        .publish(getChannel(behandlingId), JSON.stringify(getClosedMessage()))
        .exec();
    },
    scan: async (signal) => {
      await ready;
      // Fails before taking a pool connection if already stopped. `scanKeys` only checks after fetching each page.
      signal?.throwIfAborted();

      return pool.execute((client) => scanKeys(client, signal));
    },
    close: async () => {
      await Promise.all([ready.catch(() => undefined), subscriberReady.catch(() => undefined)]);
      await Promise.all([pool.close(), subscriber.close()]);
    },
  };
};

/** A pool connection. Exclusive while the task runs, so it can watch keys. */
type PoolClient = Parameters<Parameters<RedisClientPoolType['execute']>[0]>[0];

const saveWithRetry = async (
  client: PoolClient,
  document: HighlightDocument,
  changes: unknown,
  attempt: number,
): Promise<SavedChanges> => {
  try {
    return await trySave(client, document, changes);
  } catch (error) {
    if (!(error instanceof WatchError) || attempt >= MAX_SAVE_ATTEMPTS) {
      throw error;
    }
  }

  await setTimeout(Math.random() * 20 * attempt);

  return saveWithRetry(client, document, changes, attempt + 1);
};

const trySave = async (client: PoolClient, document: HighlightDocument, changes: unknown): Promise<SavedChanges> => {
  const key = getKey(document.behandlingId);
  const finishedKey = getFinishedKey(document.behandlingId);
  const field = getField(document);

  await client.watch([key, finishedKey]);

  try {
    if ((await client.exists(finishedKey)) === 1) {
      throw new BehandlingFinishedError();
    }

    const { value, ...saved } = apply(await client.hGet(key, field), changes, Date.now());
    const transaction = client.multi().hSet(key, field, value);

    for (const message of getChangeMessages(document, saved.applied)) {
      transaction.publish(getChannel(document.behandlingId), JSON.stringify(message));
    }

    await transaction.exec();

    return saved;
  } finally {
    // The connection goes back to the pool. It must not keep watching if anything above threw.
    await client.unwatch();
  }
};

const KEY_PREFIX = 'highlights:';
const FINISHED_KEY_PREFIX = 'highlights-finished:';
/** Matches both prefixes. */
const SCAN_PATTERN = 'highlights*';
// Bounds the hashes read at once.
const SCAN_COUNT = 100;

const getKey = (behandlingId: string): string => `${KEY_PREFIX}${behandlingId}`;

const getFinishedKey = (behandlingId: string): string => `${FINISHED_KEY_PREFIX}${behandlingId}`;

/** A Pub/Sub channel, not a key. */
const getChannel = (behandlingId: string): string => `highlights-events:${behandlingId}`;

/** A field in the behandling's hash. NAV-idents, document IDs and formats have no colons. */
const getField = ({ navIdent, documentId, format }: HighlightDocument): string => `${navIdent}:${documentId}:${format}`;

const parseField = (behandlingId: string, field: string): HighlightDocument | null => {
  const [navIdent, documentId, format] = field.split(':');

  if (navIdent === undefined || documentId === undefined || format === undefined || !isHighlightFormat(format)) {
    return null;
  }

  return { behandlingId, navIdent, documentId, format };
};

/** Reads all highlight hashes and finished markers in one pass, page by page. Stops between pages when `signal` aborts. */
const scanKeys = async (client: PoolClient, signal: AbortSignal | undefined): Promise<HighlightScan> => {
  // `SCAN` may return a key more than once.
  const highlightKeys = new Set<string>();
  const finishedKeys = new Set<string>();
  // Flattened once at the end. Spreading a large page into `push` could exceed the argument limit.
  const pages: HighlightEntry[][][] = [];

  for await (const keys of client.scanIterator({ MATCH: SCAN_PATTERN, COUNT: SCAN_COUNT })) {
    signal?.throwIfAborted();

    const unseen: string[] = [];

    for (const key of keys) {
      if (key.startsWith(FINISHED_KEY_PREFIX)) {
        finishedKeys.add(key);
      } else if (key.startsWith(KEY_PREFIX) && !highlightKeys.has(key)) {
        highlightKeys.add(key);
        unseen.push(key);
      }
    }

    // Reads the page's hashes in parallel. node-redis sends all the commands on this one connection
    // without waiting for each reply, so the whole page takes about one round trip instead of one per key.
    pages.push(
      await Promise.all(
        unseen.map(async (key) => getEntries(key.slice(KEY_PREFIX.length), Object.entries(await client.hGetAll(key)))),
      ),
    );
  }

  return { entries: pages.flat(2), finishedMarkerCount: finishedKeys.size };
};

const getEntries = (behandlingId: string, fields: Iterable<[string, string]>): HighlightEntry[] =>
  Array.from(fields, ([field, raw]) => {
    const document = parseField(behandlingId, field);

    if (document === null) {
      return null;
    }

    return { ...document, highlights: validateHighlights(parseStored(raw).highlights).map(summarize) };
  }).filter((entry) => entry !== null);

const summarize = ({ source, text, createdAt }: MarkerHighlight): HighlightSummary => ({
  source,
  textLength: text.length,
  createdAt,
});

/** Sends events until stopped. Stops after `closed`, since nothing may be sent after it. */
const createSender = (send: HighlightEventSender) => {
  const state = { stopped: false };

  return {
    send: (event: HighlightServerEvent | null) => {
      if (state.stopped || event === null) {
        return;
      }

      state.stopped = event.name === 'closed';
      send(event);
    },
    stop: () => {
      state.stopped = true;
    },
    isStopped: () => state.stopped,
  };
};

/** A message in the behandling's channel. `navIdent` is `null` for events to every user. */
interface EventMessage {
  navIdent: string | null;
  event: HighlightServerEvent;
}

const getChangeMessages = (
  { navIdent, behandlingId, documentId, format }: HighlightDocument,
  { added, removedIds }: HighlightChanges,
): EventMessage[] => {
  const id = getHighlightsId(behandlingId, documentId);
  const messages = [
    added.length > 0 ? toEvent('added', { id, format, highlights: added }) : null,
    removedIds.length > 0 ? toEvent('removed', { id, format, highlightIds: removedIds }) : null,
  ];

  return messages.filter((event) => event !== null).map((event) => ({ navIdent, event }));
};

const getClosedMessage = (): EventMessage => ({ navIdent: null, event: getClosedEvent() });

export const getClosedEvent = (): HighlightServerEvent => toEvent('closed', {});

/** The user's highlights in each document variant, from the behandling's hash fields. */
const getSnapshotEvent = (
  { navIdent, behandlingId }: HighlightBehandling,
  fields: Map<string, string>,
): HighlightServerEvent => {
  const documents = Array.from(fields, ([field, raw]) => {
    const document = parseField(behandlingId, field);

    if (document === null || document.navIdent !== navIdent) {
      return null;
    }

    const id = getHighlightsId(behandlingId, document.documentId);

    return { id, format: document.format, highlights: validateHighlights(parseStored(raw).highlights) };
  });

  return toEvent('snapshot', { documents: documents.filter((document) => document !== null) });
};

const toEvent = <N extends HighlightServerEventName>(
  name: N,
  data: HighlightServerEventData[N],
): HighlightServerEvent => ({ name, data: JSON.stringify({ ...data, traceparent: getTraceparent() }) });

const getTraceparent = (): string | null => {
  const carrier: Record<string, string> = {};
  propagation.inject(context.active(), carrier);
  const { traceparent = null } = carrier;

  return traceparent;
};

/** The message's event, if it is for the user. */
const getEventFor = (
  { navIdent, event }: EventMessage,
  behandling: HighlightBehandling,
): HighlightServerEvent | null => (navIdent === null || navIdent === behandling.navIdent ? event : null);

const parseEventMessage = (message: string, behandling: HighlightBehandling): HighlightServerEvent | null => {
  const value = parseJson(message);

  if (!isRecord(value)) {
    return null;
  }

  const { navIdent, event } = value;

  if (!isRecord(event)) {
    return null;
  }

  const { data } = event;
  const name = HIGHLIGHT_SERVER_EVENT_NAMES.find((eventName) => eventName === event.name);

  if ((navIdent !== null && typeof navIdent !== 'string') || name === undefined || typeof data !== 'string') {
    return null;
  }

  return getEventFor({ navIdent, event: { name, data } }, behandling);
};

/** A document variant's stored highlights, and when each removed ID was removed. */
interface StoredDocument {
  highlights: unknown;
  removed: Record<string, number>;
}

interface AppliedResult extends SavedChanges {
  /** The serialized `StoredDocument` to save. */
  value: string;
}

const apply = (raw: string | null, changes: unknown, now: number): AppliedResult => {
  const stored = parseStored(raw);
  const result = applyHighlightChanges(stored.highlights, Object.keys(stored.removed), changes);
  const storedIds = new Set(validateHighlights(stored.highlights).map(({ id }) => id));
  const requestedIds = new Set(validateHighlightChanges(changes).removedIds);
  const coveredCount = result.changes.removedIds.filter((id) => storedIds.has(id) && !requestedIds.has(id)).length;
  const removed = Object.fromEntries(
    result.removedIds
      .map((id): [string, number] => [id, stored.removed[id] ?? now])
      .filter(([, removedAt]) => now - removedAt < REMOVED_TTL_MS),
  );
  const value: StoredDocument = { highlights: result.highlights, removed };

  return { value: JSON.stringify(value), applied: result.changes, coveredCount };
};

const parseStored = (raw: string | null): StoredDocument => {
  const value = raw === null ? null : parseJson(raw);

  if (!isRecord(value)) {
    return { highlights: [], removed: {} };
  }

  const { highlights, removed } = value;

  return {
    highlights,
    removed: Object.fromEntries(
      Object.entries(isRecord(removed) ? removed : {}).filter(
        (entry): entry is [string, number] => typeof entry[1] === 'number',
      ),
    ),
  };
};

/** Never throws, since it runs in the subscriber's message handler. */
const parseJson = (json: string): unknown => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const noop = () => undefined;
