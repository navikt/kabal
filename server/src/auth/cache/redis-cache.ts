import { RedisClientType, createClient } from 'redis';
import { getLogger } from '@app/logger';
import { OboCacheTierInterface } from '@app/auth/cache/interface';
import { cacheGauge, cacheRedisGauge } from '@app/auth/cache/cache-gauge';

const log = getLogger('redis-obo-cache');

export class OboRedisCache implements OboCacheTierInterface {
  private client: RedisClientType;

  constructor(url: string, username: string, password: string) {
    this.client = createClient({ url, username, password });
    this.client.on('error', (error) => log.error({ msg: 'Redis Client Error', error }));
    this.client.connect();
  }

  public async get(key: string) {
    /**
     * ttl() gets remaining time to live in seconds.
     * Returns -2 if the key does not exist.
     * Returns -1 if the key exists but has no associated expire.
     * @see https://redis.io/docs/latest/commands/ttl/
     */
    const [token, ttl] = await Promise.all([this.client.get(key), this.client.ttl(key)]);

    if (token === null || ttl === -2) {
      cacheRedisGauge.inc({ hit: 'miss' });

      return null;
    }

    if (ttl === -1) {
      cacheRedisGauge.inc({ hit: 'invalid' });
      this.client.del(key);

      return null;
    }

    if (ttl === 0) {
      cacheRedisGauge.inc({ hit: 'expired' });

      return null;
    }

    cacheRedisGauge.inc({ hit: 'hit' });
    cacheGauge.inc({ hit: 'redis' });

    return { token, expiresAt: now() + ttl };
  }

  public async set(key: string, token: string, expiresAt: number) {
    await this.client.set(key, token, { EXAT: expiresAt });
  }
}

const now = () => Math.floor(Date.now() / 1_000);
