import { describe, expect, it, jest, mock } from 'bun:test';
import { DocumentAccessNotFoundError } from '@/document-access/api/document-access-list';
import type {
  DocumentAccessKafkaConsumerApi,
  DocumentAccessMessage,
  DocumentAccessMessageHandler,
} from '@/document-access/kafka-consumer';
import { SmartDocumentWriteAccess, SYNC_INTERVAL_MS } from '@/document-access/service';
import type { DocumentAccessList, Metadata } from '@/document-access/types';

const META: Metadata = { tab_id: undefined, client_version: 'test' };

/** Yields once so queued promise callbacks (listeners, poll/fetch chains) run. */
const flushMicrotasks = () => Promise.resolve();

const accessList = (documentId: string, navIdents: string[]): DocumentAccessList => ({ documentId, navIdents });

/** A controllable in-memory stand-in for DocumentAccessKafkaConsumer. */
class FakeKafkaConsumer implements DocumentAccessKafkaConsumerApi {
  readonly #onMessage: DocumentAccessMessageHandler;
  #connected = true;
  #errors: string[] = [];
  connectCount = 0;
  closeCount = 0;

  constructor(onMessage: DocumentAccessMessageHandler) {
    this.#onMessage = onMessage;
  }

  connect = async () => {
    this.connectCount += 1;
  };
  isConnected = () => this.#connected;
  getErrors = () => this.#errors;
  close = async () => {
    this.closeCount += 1;
  };

  setConnected = (value: boolean) => {
    this.#connected = value;
  };
  setErrors = (errors: string[]) => {
    this.#errors = errors;
  };

  /** Simulate a Kafka record arriving on the stream. */
  deliver = (message: Partial<DocumentAccessMessage> & Pick<DocumentAccessMessage, 'documentId'>) =>
    this.#onMessage({
      value: undefined,
      timestamp: BigInt(Date.now() + 60_000),
      commit: async () => undefined,
      trace_id: 'test-trace',
      ...message,
    });
}

interface Harness {
  service: SmartDocumentWriteAccess;
  consumer: FakeKafkaConsumer;
  fetchAccessList: ReturnType<typeof mock<(documentId: string, metadata: Metadata) => Promise<DocumentAccessList>>>;
}

const createService = (
  fetchImpl: (documentId: string, metadata: Metadata) => Promise<DocumentAccessList> = async (documentId) =>
    accessList(documentId, []),
): Harness => {
  let consumer: FakeKafkaConsumer | undefined;
  const fetchAccessList = mock(fetchImpl);

  const service = new SmartDocumentWriteAccess((onMessage) => {
    consumer = new FakeKafkaConsumer(onMessage);

    return consumer;
  }, fetchAccessList);

  if (consumer === undefined) {
    throw new Error('the Kafka consumer factory was not called synchronously');
  }

  return { service, consumer, fetchAccessList };
};

describe('SmartDocumentWriteAccess', () => {
  describe('hasAccess', () => {
    it('serves access from the cache without calling the API', async () => {
      const { service, consumer, fetchAccessList } = createService();

      await consumer.deliver({ documentId: 'doc', value: JSON.stringify(['Z1']) });

      expect(await service.hasAccess('doc', 'Z1', META)).toBe(true);
      expect(await service.hasAccess('doc', 'Z2', META)).toBe(false);
      expect(fetchAccessList).not.toHaveBeenCalled();
    });

    it('does not call the API for an uncached document when fetching is disallowed', async () => {
      const { service, fetchAccessList } = createService();

      expect(await service.hasAccess('doc', 'Z1', META)).toBe(false);
      expect(fetchAccessList).not.toHaveBeenCalled();
    });

    it('fetches and caches access when fetching is allowed', async () => {
      const { service, fetchAccessList } = createService(async (id) => accessList(id, ['Z1']));

      expect(await service.hasAccess('doc', 'Z1', META, true)).toBe(true);
      expect(fetchAccessList).toHaveBeenCalledTimes(1);

      // Subsequent checks are served from the cache.
      expect(await service.hasAccess('doc', 'Z1', META)).toBe(true);
      expect(fetchAccessList).toHaveBeenCalledTimes(1);
    });

    it('treats a 400 as deletion and notifies deletion listeners', async () => {
      const { service } = createService(async (id) => {
        throw new DocumentAccessNotFoundError(id);
      });

      let deleted = false;
      service.addDeletedDocumentListener('doc', () => {
        deleted = true;
      });

      expect(await service.hasAccess('doc', 'Z1', META, true)).toBe(false);
      expect(deleted).toBe(true);
    });

    it('returns false on a transient API error and does not cache', async () => {
      const { service, fetchAccessList } = createService(async () => {
        throw new Error('API call failed');
      });

      expect(await service.hasAccess('doc', 'Z1', META, true)).toBe(false);
      expect(await service.hasAccess('doc', 'Z1', META, true)).toBe(false);
      expect(fetchAccessList).toHaveBeenCalledTimes(2);
    });
  });

  describe('Kafka message processing', () => {
    it('applies an update and notifies has-access listeners', async () => {
      const { service, consumer } = createService();

      const received: boolean[] = [];
      service.addHasAccessListener('doc', 'Z1', META, (value) => received.push(value));
      await flushMicrotasks(); // immediate callback: uncached -> false

      const commit = mock(async () => undefined);
      await consumer.deliver({ documentId: 'doc', value: JSON.stringify(['Z1']), commit });

      expect(received.at(-1)).toBe(true);
      expect(commit).toHaveBeenCalledTimes(1);
    });

    it('re-notifies on a repeated Kafka update (push path has no sameMembers guard)', async () => {
      const { service, consumer } = createService();

      await consumer.deliver({ documentId: 'doc', value: JSON.stringify(['Z1']) });

      const received: boolean[] = [];
      service.addHasAccessListener('doc', 'Z1', META, (value) => received.push(value));
      await flushMicrotasks(); // immediate callback: cached -> true

      await consumer.deliver({ documentId: 'doc', value: JSON.stringify(['Z1']) });

      expect(received).toEqual([true, true]);
    });

    it('handles a tombstone as deletion', async () => {
      const { service, consumer } = createService();

      await consumer.deliver({ documentId: 'doc', value: JSON.stringify(['Z1']) });

      const accessEvents: boolean[] = [];
      let deleted = false;
      service.addHasAccessListener('doc', 'Z1', META, (value) => accessEvents.push(value));
      service.addDeletedDocumentListener('doc', () => {
        deleted = true;
      });
      await flushMicrotasks();

      const commit = mock(async () => undefined);
      await consumer.deliver({ documentId: 'doc', value: undefined, commit });

      expect(deleted).toBe(true);
      expect(accessEvents.at(-1)).toBe(false);
      expect(commit).toHaveBeenCalledTimes(1);
      expect(await service.hasAccess('doc', 'Z1', META)).toBe(false);
    });

    it('ignores an outdated message for a cached document', async () => {
      const { service, consumer } = createService();

      await consumer.deliver({ documentId: 'doc', value: JSON.stringify(['Z1']) });

      const commit = mock(async () => undefined);
      await consumer.deliver({ documentId: 'doc', value: JSON.stringify(['Z1', 'Z2']), timestamp: 0n, commit });

      expect(commit).toHaveBeenCalledTimes(1);
      expect(await service.hasAccess('doc', 'Z2', META)).toBe(false);
    });
  });

  describe('lifecycle', () => {
    it('delegates getErrors to the Kafka consumer', () => {
      const { service, consumer } = createService();

      consumer.setErrors(['Kafka consumer is not connected']);

      expect(service.getErrors()).toEqual(['Kafka consumer is not connected']);
    });

    it('is not ready until init completes, and closes cleanly', async () => {
      const { service, consumer } = createService();

      expect(service.isReady()).toBe(false);

      await service.init();

      expect(service.isReady()).toBe(true);
      expect(consumer.connectCount).toBe(1);

      await service.close();

      expect(consumer.closeCount).toBe(1);
    });
  });

  describe('fallback polling', () => {
    it('polls active documents and applies updates while Kafka is unavailable', async () => {
      jest.useFakeTimers();

      const { service, consumer, fetchAccessList } = createService(async (id) => accessList(id, ['Z1']));

      const received: boolean[] = [];
      service.addHasAccessListener('doc', 'Z1', META, (value) => received.push(value)); // makes 'doc' active

      await service.init();

      consumer.setConnected(true);
      consumer.setErrors(['Kafka consumer is not active']); // unhealthy -> poll runs
      jest.advanceTimersByTime(SYNC_INTERVAL_MS);
      await flushMicrotasks();

      expect(fetchAccessList).toHaveBeenCalledTimes(1);
      expect(fetchAccessList.mock.calls[0]?.[0]).toBe('doc');
      expect(received.at(-1)).toBe(true);

      await service.close();
      jest.useRealTimers();
    });

    it('does not poll documents without active connections', async () => {
      jest.useFakeTimers();

      const { service, consumer, fetchAccessList } = createService();

      await service.init();

      consumer.setConnected(true);
      consumer.setErrors(['Kafka consumer is not active']);
      jest.advanceTimersByTime(SYNC_INTERVAL_MS);
      await flushMicrotasks();

      expect(fetchAccessList).not.toHaveBeenCalled();

      await service.close();
      jest.useRealTimers();
    });

    it('only notifies once when consecutive polls return unchanged membership', async () => {
      jest.useFakeTimers();

      const { service, consumer, fetchAccessList } = createService(async (id) => accessList(id, ['Z1']));

      const received: boolean[] = [];
      service.addHasAccessListener('doc', 'Z1', META, (value) => received.push(value)); // active; immediate -> false
      await service.init();
      await flushMicrotasks();

      consumer.setConnected(true);
      consumer.setErrors(['Kafka consumer is not active']);
      jest.advanceTimersByTime(SYNC_INTERVAL_MS); // undefined -> ['Z1'] -> notify true
      await flushMicrotasks();
      jest.advanceTimersByTime(SYNC_INTERVAL_MS); // ['Z1'] -> ['Z1'] -> unchanged -> no notify
      await flushMicrotasks();

      expect(received).toEqual([false, true]);
      expect(fetchAccessList).toHaveBeenCalledTimes(2);

      await service.close();
      jest.useRealTimers();
    });
  });
});
