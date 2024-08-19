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
import { RedisClientType, createClient } from 'redis';
import { v4 as uuid } from 'uuid';

export interface Configuration {
  port: number;
  host: string;
  options?: { url: string; username: string; password: string };
  identifier: string;
  prefix: string;
  lockTimeout: number;
  disconnectDelay: number;
}

export class RedisExtension implements Extension {
  priority = 1000;
  configuration: Configuration = {
    port: 6379,
    host: '127.0.0.1',
    prefix: 'hocuspocus',
    identifier: `host-${uuid()}`,
    lockTimeout: 1000,
    disconnectDelay: 1000,
  };
  redisTransactionOrigin = '__hocuspocus__redis__origin__';
  pub: RedisClientType;
  sub: RedisClientType;
  instance!: Hocuspocus;
  logger: Debugger;
  messagePrefix: Buffer;

  public constructor(configuration: Partial<Configuration>) {
    this.configuration = { ...this.configuration, ...configuration };
    this.logger = new Debugger();

    const { options } = this.configuration;

    this.pub = createClient(options);
    this.sub = createClient(options);

    this.sub.on('messageBuffer', this.handleIncomingMessage);

    const identifierBuffer = Buffer.from(this.configuration.identifier, 'utf-8');
    this.messagePrefix = Buffer.concat([Buffer.from([identifierBuffer.length]), identifierBuffer]);
  }

  async onConfigure({ instance }: onConfigurePayload) {
    this.logger = instance.debugger;

    this.instance = instance;
  }

  private getKey(documentName: string) {
    return `${this.configuration.prefix}:${documentName}`;
  }

  private pubKey(documentName: string) {
    return this.getKey(documentName);
  }

  private subKey(documentName: string) {
    return this.getKey(documentName);
  }

  private encodeMessage(message: Uint8Array) {
    return Buffer.concat([this.messagePrefix, Buffer.from(message)]);
  }

  private decodeMessage(buffer: Buffer) {
    const [identifierLength] = buffer;

    if (identifierLength === undefined) {
      throw new Error('Invalid message received');
    }

    const identifier = buffer.toString('utf-8', 1, identifierLength + 1);

    return [identifier, buffer.subarray(identifierLength + 1)];
  }

  public async afterLoadDocument({ documentName, document }: afterLoadDocumentPayload) {
    return new Promise((resolve, reject) => {
      // On document creation the node will connect to pub and sub channels
      // for the document.
      this.sub.subscribe(this.subKey(documentName), async (error) => {
        if (error) {
          reject(error);

          return;
        }

        this.publishFirstSyncStep(documentName, document);
        this.requestAwarenessFromOtherInstances(documentName);

        resolve(undefined);
      });
    });
  }

  private async publishFirstSyncStep(documentName: string, document: Document) {
    const syncMessage = new OutgoingMessage(documentName).createSyncMessage().writeFirstSyncStepFor(document);

    return this.pub.publish(this.pubKey(documentName), this.encodeMessage(syncMessage.toUint8Array()));
  }

  private async requestAwarenessFromOtherInstances(documentName: string) {
    const awarenessMessage = new OutgoingMessage(documentName).writeQueryAwareness();

    return this.pub.publish(this.pubKey(documentName), this.encodeMessage(awarenessMessage.toUint8Array()));
  }

  async afterStoreDocument({ socketId }: afterStoreDocumentPayload) {
    // if the change was initiated by a directConnection, we need to delay this hook to make sure sync can finish first.
    // for provider connections, this usually happens in the onDisconnect hook
    if (socketId === 'server') {
      await new Promise((resolve) => {
        setTimeout(() => resolve(''), this.configuration.disconnectDelay);
      });
    }
  }

  async onAwarenessUpdate({ documentName, awareness, added, updated, removed }: onAwarenessUpdatePayload) {
    const changedClients = added.concat(updated, removed);
    const message = new OutgoingMessage(documentName).createAwarenessUpdateMessage(awareness, changedClients);

    return this.pub.publish(this.pubKey(documentName), this.encodeMessage(message.toUint8Array()));
  }

  private handleIncomingMessage = async (_channel: Buffer, data: Buffer) => {
    const [identifier, messageBuffer] = this.decodeMessage(data);

    if (identifier === this.configuration.identifier) {
      return;
    }

    const message = new IncomingMessage(messageBuffer);
    const documentName = message.readVarString();
    message.writeVarString(documentName);

    const document = this.instance.documents.get(documentName);

    if (!document) {
      // What does this mean? Why are we subscribed to this document?
      this.logger.log(`Received message for unknown document ${documentName}`);

      return;
    }

    new MessageReceiver(message, this.logger, this.redisTransactionOrigin).apply(document, undefined, (reply) =>
      this.pub.publish(this.pubKey(document.name), this.encodeMessage(reply)),
    );
  };

  public async onChange(data: onChangePayload) {
    if (data.transactionOrigin !== this.redisTransactionOrigin) {
      return this.publishFirstSyncStep(data.documentName, data.document);
    }
  }

  public onDisconnect = async ({ documentName }: onDisconnectPayload) => {
    const disconnect = () => {
      const document = this.instance.documents.get(documentName);

      // Do nothing, when other users are still connected to the document.
      if (!document || document.getConnectionsCount() > 0) {
        return;
      }

      // Time to end the subscription on the document channel.
      this.sub.unsubscribe(this.subKey(documentName), (error) => {
        if (error) {
          console.error(error);
        }
      });

      this.instance.unloadDocument(document);
    };
    // Delay the disconnect procedure to allow last minute syncs to happen
    setTimeout(disconnect, this.configuration.disconnectDelay);
  };

  async beforeBroadcastStateless(data: beforeBroadcastStatelessPayload) {
    const message = new OutgoingMessage(data.documentName).writeBroadcastStateless(data.payload);

    return this.pub.publish(this.pubKey(data.documentName), this.encodeMessage(message.toUint8Array()));
  }

  async onDestroy() {
    this.pub.disconnect();
    this.sub.disconnect();
  }
}
