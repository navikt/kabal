import { memoryCacheGauge, persistentCacheGauge, persistentCacheSizeGauge } from '@app/auth/cache/cache-gauge';
import type { TokenMessage } from '@app/auth/cache/types';
import { getLogger } from '@app/logger';
import { createClient, type RedisClientType as ValkeyClientType } from 'redis';

const log = getLogger('obo-persistent-cache');

export type TokenListener = (message: TokenMessage) => void;

const TOKEN_CHANNEL = 'obo-token';

export class OboPersistentCache {
  #client: ValkeyClientType;
  #subscribeClient: ValkeyClientType;

  #listeners: TokenListener[] = [];

  constructor(url: string, username: string, password: string) {
    this.#client = createClient({ url, username, password, pingInterval: 3_000 });
    this.#client.on('error', (error) => log.error({ msg: 'Valkey Data Client Error', error }));

    this.#subscribeClient = this.#client.duplicate();
    this.#subscribeClient.on('error', (error) => log.error({ msg: 'Valkey Subscribe Client Error', error }));
  }

  public async init() {
    await Promise.all([this.#subscribeClient.connect(), this.#client.connect()]);

    await this.#subscribeClient.subscribe(TOKEN_CHANNEL, (json) => {
      try {
        const parsed: unknown = JSON.parse(json);

        if (!isTokenMessage(parsed)) {
          log.warn({ msg: 'Invalid token message' });

          return;
        }

        for (const listener of this.#listeners) {
          listener(parsed);
        }
      } catch (error) {
        log.warn({ msg: 'Failed to parse token message', error });
      }
    });

    await this.#refreshCacheSizeMetric();

    setInterval(() => this.#refreshCacheSizeMetric(), 30_000);
  }

  #refreshCacheSizeMetric = async () => {
    const count = await this.#client.dbSize();
    persistentCacheSizeGauge.set(count);
  };

  public async getAll(): Promise<TokenMessage[]> {
    const keys = await this.#client.keys('*');

    if (keys.length === 0) {
      return [];
    }

    const tokens = await this.#client.mGet(keys);

    const promises = tokens.map(async (token, index) => {
      if (token === null) {
        return null;
      }

      const key = keys[index];

      if (key === undefined) {
        return null;
      }

      const ttl = await this.#client.ttl(key);

      if (ttl <= 0) {
        return null;
      }

      return { token, key, expiresAt: now() + ttl };
    });

    return Promise.all(promises).then((results) => results.filter(isNotNull));
  }

  public async get(key: string) {
    /**
     * ttl() gets remaining time to live in seconds.
     * Returns -2 if the key does not exist.
     * Returns -1 if the key exists but has no associated expire.
     * @see https://valkey.io/commands/ttl/
     */
    const [token, ttl] = await Promise.all([this.#client.get(key), this.#client.ttl(key)]);

    if (token === null || ttl === -2) {
      persistentCacheGauge.inc({ hit: 'miss' });

      return null;
    }

    if (ttl === -1) {
      persistentCacheGauge.inc({ hit: 'invalid' });
      this.#client.del(key);
      await this.#refreshCacheSizeMetric();

      return null;
    }

    if (ttl === 0) {
      persistentCacheGauge.inc({ hit: 'expired' });

      return null;
    }

    persistentCacheGauge.inc({ hit: 'hit' });
    memoryCacheGauge.inc({ hit: 'persistent' });

    return { token, expiresAt: now() + ttl };
  }

  public async set(key: string, token: string, expiresAt: number) {
    log.debug({ msg: 'Setting OBO token', data: { key, token, expiresAt } });
    const json = JSON.stringify({ key, token, expiresAt } satisfies TokenMessage);
    this.#client.publish(TOKEN_CHANNEL, json);

    await this.#client.set(key, token, { EXAT: expiresAt });

    await this.#refreshCacheSizeMetric();
  }

  public addTokenListener(listener: TokenListener) {
    this.#listeners.push(listener);
  }

  public removeTokenListener(listener: TokenListener) {
    const index = this.#listeners.indexOf(listener);

    if (index !== -1) {
      this.#listeners.splice(index, 1);
    }
  }

  public get isReady() {
    return (
      this.#client.isReady &&
      this.#client.isOpen &&
      this.#subscribeClient.isReady &&
      this.#subscribeClient.isOpen &&
      this.#subscribeClient.isPubSubActive
    );
  }
}

const now = () => Math.floor(Date.now() / 1_000);

const isNotNull = <T>(value: T | null): value is T => value !== null;

const isTokenMessage = (message: unknown): message is TokenMessage => {
  if (typeof message !== 'object' || message === null) {
    return false;
  }

  const { key, token, expiresAt } = message as TokenMessage;

  return typeof key === 'string' && typeof token === 'string' && typeof expiresAt === 'number';
};
