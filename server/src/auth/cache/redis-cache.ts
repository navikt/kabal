import { RedisClientType, createClient } from 'redis';
import { getLogger } from '@app/logger';
import { memoryCacheGauge, redisCacheGauge, redisCacheSizeGauge } from '@app/auth/cache/cache-gauge';
import { TokenMessage } from '@app/auth/cache/types';

const log = getLogger('obo-redis-cache');

export type TokenListener = (message: TokenMessage) => void;

const TOKEN_CHANNEL = 'obo-token';

export class OboRedisCache {
  #subscribeClient: RedisClientType;
  #publishClient: RedisClientType;
  #dataClient: RedisClientType;

  #listeners: TokenListener[] = [];

  constructor(url: string, username: string, password: string) {
    this.#dataClient = createClient({ url, username, password, pingInterval: 3_000 });
    this.#dataClient.on('error', (error) => log.error({ msg: 'Redis Data Client Error', error }));

    this.#subscribeClient = this.#dataClient.duplicate();
    this.#subscribeClient.on('error', (error) => log.error({ msg: 'Redis Subscribe Client Error', error }));

    this.#publishClient = this.#dataClient.duplicate();
    this.#publishClient.on('error', (error) => log.error({ msg: 'Redis Publish Client Error', error }));
  }

  public async init() {
    await Promise.all([this.#subscribeClient.connect(), this.#publishClient.connect(), this.#dataClient.connect()]);

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

    this.#refreshCacheSizeMetric();
  }

  #refreshCacheSizeMetric = async () => {
    const count = await this.#dataClient.dbSize();
    redisCacheSizeGauge.set(count);
  };

  public async getAll(): Promise<TokenMessage[]> {
    const keys = await this.#dataClient.keys('*');

    if (keys.length === 0) {
      return [];
    }

    const tokens = await this.#dataClient.mGet(keys);

    const promises = tokens.map(async (token, index) => {
      if (token === null) {
        return null;
      }

      const key = keys[index];

      if (key === undefined) {
        return null;
      }
      const ttl = await this.#dataClient.ttl(key);

      if (ttl === -2 || ttl === -1 || ttl === 0) {
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
     * @see https://redis.io/docs/latest/commands/ttl/
     */
    const [token, ttl] = await Promise.all([this.#dataClient.get(key), this.#dataClient.ttl(key)]);

    if (token === null || ttl === -2) {
      redisCacheGauge.inc({ hit: 'miss' });

      return null;
    }

    if (ttl === -1) {
      redisCacheGauge.inc({ hit: 'invalid' });
      this.#dataClient.del(key);
      this.#refreshCacheSizeMetric();

      return null;
    }

    if (ttl === 0) {
      redisCacheGauge.inc({ hit: 'expired' });

      return null;
    }

    redisCacheGauge.inc({ hit: 'hit' });
    memoryCacheGauge.inc({ hit: 'redis' });

    return { token, expiresAt: now() + ttl };
  }

  public async set(key: string, token: string, expiresAt: number) {
    const json = JSON.stringify({ key, token, expiresAt } satisfies TokenMessage);
    this.#publishClient.publish(TOKEN_CHANNEL, json);

    await this.#dataClient.set(key, token, { EXAT: expiresAt });

    this.#refreshCacheSizeMetric();
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
      this.#dataClient.isReady &&
      this.#dataClient.isOpen &&
      this.#publishClient.isReady &&
      this.#publishClient.isOpen &&
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
