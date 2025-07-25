import { randomUUID } from 'node:crypto';
import { getLogger } from '@app/logger';
import type { ValkeyOptions } from '@app/plugins/crdt/valkey-extension/types';
import {
  type afterLoadDocumentPayload,
  type afterStoreDocumentPayload,
  type beforeBroadcastStatelessPayload,
  type Document,
  type Extension,
  type Hocuspocus,
  IncomingMessage,
  MessageReceiver,
  OutgoingMessage,
  type onAwarenessUpdatePayload,
  type onChangePayload,
  type onConfigurePayload,
  type onDisconnectPayload,
} from '@hocuspocus/server';
import { createClient, type RedisClientType as ValkeyClientType } from 'redis';

const log = getLogger('valkey-extension');

export class ValkeyExtension implements Extension {
  readonly #prefix = 'hocuspocus';
  readonly #identifier = `host-${randomUUID()}`;
  readonly #disconnectDelay = 1_000;
  readonly #valkeyConnectionRetryDelay = 100;
  // Referenced here: https://github.com/ueberdosis/hocuspocus/blob/main/packages/server/src/Hocuspocus.ts#L412
  readonly #valkeyTransactionOrigin = '__hocuspocus__redis__origin__';
  readonly #pub: ValkeyClientType;
  readonly #sub: ValkeyClientType;
  readonly #messagePrefix: Buffer;
  instance?: Hocuspocus;

  #isReady = false;

  public constructor(options: ValkeyOptions) {
    log.debug({ msg: 'Creating ValkeyExtension', data: { identifier: this.#identifier } });

    this.#pub = createClient({ ...options, pingInterval: 30_000 });
    this.#sub = this.#pub.duplicate();

    this.#pub.on('error', (error) =>
      log.error({ msg: 'Valkey publish client error', error, data: { identifier: this.#identifier } }),
    );
    this.#sub.on('error', (error) =>
      log.error({ msg: 'Valkey subscribe client error', error, data: { identifier: this.#identifier } }),
    );

    this.#init();

    const identifierBuffer = Buffer.from(this.#identifier, 'utf-8');
    this.#messagePrefix = Buffer.concat([Buffer.from([identifierBuffer.length]), identifierBuffer]);
  }

  #init() {
    Promise.all([this.#sub.connect(), this.#pub.connect()])
      .then(() => {
        this.#isReady = true;
      })
      .catch((error) => {
        log.error({ msg: 'Failed to connect to Valkey', error, data: { identifier: this.#identifier } });
      });
  }

  onConfigure({ instance }: onConfigurePayload) {
    log.debug({ msg: 'Configuring ValkeyExtension', data: { identifier: this.#identifier } });
    this.instance = instance;
    return Promise.resolve();
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

    log.debug({
      msg: `Subscribing to document: ${documentName}`,
      data: { document: documentName, identifier: this.#identifier },
    });

    if (!this.#isReady) {
      log.warn({
        msg: 'Valkey is not ready',
        data: { document: documentName, method: 'afterLoadDocument', identifier: this.#identifier },
      });

      await delay(this.#valkeyConnectionRetryDelay);

      return this.afterLoadDocument(params);
    }

    if (this.instance !== undefined && !this.instance.documents.has(documentName)) {
      log.warn({
        msg: 'Loaded document was not in documents map. Adding to documents map.',
        data: { document: documentName, method: 'afterLoadDocument', identifier: this.#identifier },
      });

      this.instance?.documents.set(documentName, document);
    }

    // On document creation the node will connect to pub and sub channels for the document.
    await this.#sub.subscribe(
      this.#getKey(documentName),
      async (msg) => this.#handleIncomingMessage(msg, document),
      true,
    );

    await Promise.all([
      this.#publishFirstSyncStep(documentName, document),
      this.#requestAwarenessFromOtherInstances(documentName),
    ]);
  }

  async #handleIncomingMessage(data: Buffer, document: Document) {
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
        data: { document: documentName, method: 'handleIncomingMessage', identifier },
      });

      return;
    }

    if (document === undefined) {
      // Received message for unknown document. Should not happen.
      const knownDocuments = Array.from(this.instance.documents.keys()).join(', ');

      log.error({
        msg: `${identifier} Received message for unknown document "${documentName}". Known documents "${knownDocuments}"`,
        data: {
          document: documentName,
          knownDocuments,
          knownDocumentCount: this.instance.documents.size,
          identifier,
        },
      });

      return;
    }

    new MessageReceiver(message, this.#valkeyTransactionOrigin).apply(document, undefined, (reply) =>
      this.#pub.publish(this.#getKey(document.name), this.#encodeMessage(reply)),
    );
  }

  async #publishFirstSyncStep(documentName: string, document: Document): Promise<number> {
    if (!this.#isReady) {
      log.warn({
        msg: 'Valkey is not ready',
        data: { document: documentName, method: 'publishFirstSyncStep', identifier: this.#identifier },
      });

      await delay(this.#valkeyConnectionRetryDelay);

      return this.#publishFirstSyncStep(documentName, document);
    }

    const syncMessage = new OutgoingMessage(documentName).createSyncMessage().writeFirstSyncStepFor(document);

    return this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(syncMessage.toUint8Array()));
  }

  async #requestAwarenessFromOtherInstances(documentName: string): Promise<number> {
    if (!this.#isReady) {
      log.warn({
        msg: 'Valkey is not ready',
        data: { document: documentName, method: 'requestAwarenessFromOtherInstances', identifier: this.#identifier },
      });

      await delay(this.#valkeyConnectionRetryDelay);

      return this.#requestAwarenessFromOtherInstances(documentName);
    }

    const awarenessMessage = new OutgoingMessage(documentName).writeQueryAwareness();

    return this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(awarenessMessage.toUint8Array()));
  }

  async afterStoreDocument({ socketId }: afterStoreDocumentPayload) {
    // If the change was initiated by a directConnection, we need to delay this hook to make sure sync can finish first.
    // For provider connections, this usually happens in the onDisconnect hook.
    if (socketId === 'server' && this.#disconnectDelay > 0) {
      await delay(this.#disconnectDelay);
    }
  }

  async onAwarenessUpdate(params: onAwarenessUpdatePayload): Promise<number> {
    const { documentName, awareness, added, updated, removed } = params;

    if (!this.#isReady) {
      log.warn({
        msg: 'Valkey is not ready',
        data: { document: documentName, method: 'onAwarenessUpdate', identifier: this.#identifier },
      });

      await delay(this.#valkeyConnectionRetryDelay);

      return this.onAwarenessUpdate(params);
    }

    const changedClients = added.concat(updated, removed);
    const message = new OutgoingMessage(documentName).createAwarenessUpdateMessage(awareness, changedClients);

    return this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(message.toUint8Array()));
  }

  public async onChange({ documentName, document, transactionOrigin }: onChangePayload): Promise<void> {
    if (transactionOrigin === this.#valkeyTransactionOrigin) {
      return Promise.resolve();
    }

    await this.#publishFirstSyncStep(documentName, document);

    return Promise.resolve();
  }

  public async onDisconnect({ documentName, document }: onDisconnectPayload): Promise<void> {
    log.debug({
      msg: `onDisconnect - document: ${documentName}`,
      data: { document: documentName, identifier: this.#identifier },
    });

    // Delay the disconnect procedure to allow last minute syncs to happen.
    setTimeout(() => this.#disconnect(documentName, document), this.#disconnectDelay);
  }

  async #disconnect(documentName: string, document: Document): Promise<void> {
    if (this.instance === undefined) {
      log.warn({
        msg: 'HocusPocus instance is undefined',
        data: { document: documentName, method: 'disconnect', identifier: this.#identifier },
      });

      try {
        // Time to end the subscription on the document channel.
        await this.#sub.unsubscribe(this.#getKey(documentName));
      } catch (error) {
        log.error({
          msg: `Failed to unsubscribe from document: "${documentName}"`,
          error,
          data: { document: documentName, identifier: this.#identifier },
        });
      }

      return;
    }

    // Do nothing when other users are still connected to the document.
    if (document.getConnectionsCount() > 0) {
      return;
    }

    try {
      // Time to end the subscription on the document channel.
      await this.#sub.unsubscribe(this.#getKey(documentName));
    } catch (error) {
      log.error({
        msg: `Failed to unsubscribe from document: "${documentName}"`,
        error,
        data: { document: documentName, identifier: this.#identifier },
      });
    }

    this.instance.unloadDocument(document);
  }

  public async beforeBroadcastStateless(data: beforeBroadcastStatelessPayload): Promise<void> {
    const { documentName } = data;

    log.debug({
      msg: `beforeBroadcastStateless - document: ${documentName}`,
      data: { document: documentName, identifier: this.#identifier },
    });

    if (!this.#isReady) {
      log.warn({
        msg: 'Valkey is not ready',
        data: { document: documentName, method: 'beforeBroadcastStateless', identifier: this.#identifier },
      });

      await delay(this.#valkeyConnectionRetryDelay);

      return this.beforeBroadcastStateless(data);
    }

    const message = new OutgoingMessage(documentName).writeBroadcastStateless(data.payload);

    this.#pub.publish(this.#getKey(documentName), this.#encodeMessage(message.toUint8Array()));
  }

  public onDestroy() {
    log.debug({ msg: 'Destroying ValkeyExtension', data: { identifier: this.#identifier } });

    this.#pub.disconnect();
    this.#sub.disconnect();

    return Promise.resolve();
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
