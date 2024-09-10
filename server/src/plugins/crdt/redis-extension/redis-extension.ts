import { getLogger } from '@app/logger';
import { RedisOptions } from '@app/plugins/crdt/redis-extension/types';
import {
  Debugger,
  Document,
  Extension,
  Hocuspocus,
  IncomingMessage,
  MessageReceiver,
  OutgoingMessage,
  afterLoadDocumentPayload,
  afterStoreDocumentPayload,
  beforeBroadcastStatelessPayload,
  onAwarenessUpdatePayload,
  onChangePayload,
  onConfigurePayload,
  onDisconnectPayload,
} from '@hocuspocus/server';
import { randomUUID } from 'node:crypto';
import { RedisClientType, createClient } from 'redis';

const log = getLogger('redis-extension');

export class RedisExtension implements Extension {
  readonly #prefix = 'hocuspocus';
  readonly #identifier = `host-${randomUUID()}`;
  readonly #disconnectDelay = 1_000;
  readonly #redisConnectionRetryDelay = 100;
  readonly #redisTransactionOrigin = '__hocuspocus__redis__origin__';
  readonly #pub: RedisClientType;
  readonly #sub: RedisClientType;
  readonly #messagePrefix: Buffer;
  instance?: Hocuspocus;

  #isReady = false;

  public constructor(options: RedisOptions) {
    log.debug({ msg: 'Creating RedisExtension' });

    this.#pub = createClient(options);
    this.#sub = this.#pub.duplicate();

    this.#pub.on('error', (error) => log.error({ msg: 'Redis publish client error', error }));
    this.#sub.on('error', (error) => log.error({ msg: 'Redis subscribe client error', error }));

    this.#init();

    const identifierBuffer = Buffer.from(this.#identifier, 'utf-8');
    this.#messagePrefix = Buffer.concat([Buffer.from([identifierBuffer.length]), identifierBuffer]);
  }

  async #init() {
    await Promise.all([this.#sub.connect(), this.#pub.connect()]);

    this.#isReady = true;
  }

  async onConfigure({ instance }: onConfigurePayload) {
    log.debug({ msg: 'Configuring RedisExtension' });
    this.instance = instance;
  }

  #getKey = (documentName: string) => `${this.#prefix}:${documentName}`;

  #encodeMessage = (message: Uint8Array) => Buffer.concat([this.#messagePrefix, Buffer.from(message)]);

  #decodeMessage(buffer: Buffer): [string, Buffer] {
    const [identifierLength] = buffer;

    if (identifierLength === undefined) {
      throw new Error('Invalid message received');
    }

    const messageStart = identifierLength + 1;
    const identifier = buffer.toString('utf-8', 1, messageStart);

    return [identifier, buffer.subarray(messageStart)];
  }

  public async afterLoadDocument(params: afterLoadDocumentPayload): Promise<void> {
    const { documentName, document } = params;

    log.debug({ msg: `Subscribing to document: ${documentName}` });

    if (!this.#isReady) {
      log.warn({ msg: 'Redis is not ready', data: { document: documentName, method: 'afterLoadDocument' } });

      await delay(this.#redisConnectionRetryDelay);

      return this.afterLoadDocument(params);
    }

    // On document creation the node will connect to pub and sub channels
    // for the document.
    await this.#sub.subscribe(this.#getKey(documentName), async (msg) => this.#handleIncomingMessage(msg), true);

    await Promise.all([
      this.#publishFirstSyncStep(documentName, document),
      this.#requestAwarenessFromOtherInstances(documentName),
    ]);
  }

  async #handleIncomingMessage(data: Buffer) {
    const [identifier, messageBuffer] = this.#decodeMessage(data);

    if (identifier === this.#identifier) {
      return;
    }

    const message = new IncomingMessage(messageBuffer);
    const documentName = message.readVarString();
    message.writeVarString(documentName);

    if (this.instance === undefined) {
      log.warn({
        msg: 'HocusPocus instance is undefined',
        data: { document: documentName, method: 'handleIncomingMessage' },
      });

      return;
    }

    const document = this.instance.documents.get(documentName);

    if (document === undefined) {
      // Received message for unknown document. Should not happen.
      log.error({ msg: `Received message for unknown document ${documentName}` });

      return;
    }

    new MessageReceiver(message, new Debugger(), this.#redisTransactionOrigin).apply(document, undefined, (reply) =>
      this.#pub.publish(this.#getKey(document.name), this.#encodeMessage(reply)),
    );
  }

  async #publishFirstSyncStep(documentName: string, document: Document): Promise<number> {
    if (!this.#isReady) {
      log.warn({ msg: 'Redis is not ready', data: { document: documentName, method: 'publishFirstSyncStep' } });

      await delay(this.#redisConnectionRetryDelay);

      return this.#publishFirstSyncStep(documentName, document);
    }

    const syncMessage = new OutgoingMessage(documentName).createSyncMessage().writeFirstSyncStepFor(document);

    return this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(syncMessage.toUint8Array()));
  }

  async #requestAwarenessFromOtherInstances(documentName: string): Promise<number> {
    if (!this.#isReady) {
      log.warn({
        msg: 'Redis is not ready',
        data: { document: documentName, method: 'requestAwarenessFromOtherInstances' },
      });

      await delay(this.#redisConnectionRetryDelay);

      return this.#requestAwarenessFromOtherInstances(documentName);
    }

    const awarenessMessage = new OutgoingMessage(documentName).writeQueryAwareness();

    return this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(awarenessMessage.toUint8Array()));
  }

  async afterStoreDocument({ socketId }: afterStoreDocumentPayload) {
    log.debug({ msg: `afterStoreDocument - socket: ${socketId}` });

    // If the change was initiated by a directConnection, we need to delay this hook to make sure sync can finish first.
    // For provider connections, this usually happens in the onDisconnect hook.
    if (socketId === 'server' && this.#disconnectDelay > 0) {
      await delay(this.#disconnectDelay);
    }
  }

  async onAwarenessUpdate(params: onAwarenessUpdatePayload): Promise<number> {
    const { documentName, awareness, added, updated, removed } = params;
    log.debug({ msg: `onAwarenessUpdate - document: ${documentName}` });

    if (!this.#isReady) {
      log.warn({ msg: 'Redis is not ready', data: { document: documentName, method: 'onAwarenessUpdate' } });

      await delay(this.#redisConnectionRetryDelay);

      return this.onAwarenessUpdate(params);
    }

    const changedClients = added.concat(updated, removed);
    const message = new OutgoingMessage(documentName).createAwarenessUpdateMessage(awareness, changedClients);

    return this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(message.toUint8Array()));
  }

  public async onChange(data: onChangePayload): Promise<void> {
    log.debug({ msg: `onChange - document: ${data.documentName}` });

    if (data.transactionOrigin === this.#redisTransactionOrigin) {
      return;
    }

    this.#publishFirstSyncStep(data.documentName, data.document);
  }

  public async onDisconnect({ documentName }: onDisconnectPayload): Promise<void> {
    log.debug({ msg: `onDisconnect - document: ${documentName}` });

    // Delay the disconnect procedure to allow last minute syncs to happen.
    setTimeout(() => this.#disconnect(documentName), this.#disconnectDelay);
  }

  async #disconnect(documentName: string): Promise<void> {
    if (this.instance === undefined) {
      log.warn({ msg: 'HocusPocus instance is undefined', data: { document: documentName, method: 'disconnect' } });

      // Time to end the subscription on the document channel.
      return await this.#sub.unsubscribe(this.#getKey(documentName));
    }

    const document = this.instance.documents.get(documentName);

    // Do nothing, when other users are still connected to the document.
    if (document === undefined || document.getConnectionsCount() > 0) {
      return;
    }

    // Time to end the subscription on the document channel.
    await this.#sub.unsubscribe(this.#getKey(documentName));

    this.instance.unloadDocument(document);
  }

  public async beforeBroadcastStateless(data: beforeBroadcastStatelessPayload): Promise<void> {
    const { documentName } = data;

    log.debug({ msg: `beforeBroadcastStateless - document: ${documentName}` });

    if (!this.#isReady) {
      log.warn({ msg: 'Redis is not ready', data: { document: documentName, method: 'beforeBroadcastStateless' } });

      await delay(this.#redisConnectionRetryDelay);

      return this.beforeBroadcastStateless(data);
    }

    const message = new OutgoingMessage(documentName).writeBroadcastStateless(data.payload);

    this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(message.toUint8Array()));
  }

  public async onDestroy() {
    log.debug({ msg: 'Destroying RedisExtension' });

    this.#pub.disconnect();
    this.#sub.disconnect();
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
