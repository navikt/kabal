import { OboCacheInterface } from '@app/auth/cache/interface';
import { oboMemoryCache } from '@app/auth/cache/memory-cache';
import { OboRedisCache } from '@app/auth/cache/redis-cache';
import { optionalEnvString } from '@app/config/env-var';

const REDIS_URI = optionalEnvString('REDIS_URI_OBO_CACHE');
const REDIS_USERNAME = optionalEnvString('REDIS_USERNAME_OBO_CACHE');
const REDIS_PASSWORD = optionalEnvString('REDIS_PASSWORD_OBO_CACHE');

class OboTieredCache implements OboCacheInterface {
  private oboRedisCache: OboRedisCache;

  constructor(redisUri: string, redisUsername: string, redisPassword: string) {
    this.oboRedisCache = new OboRedisCache(redisUri, redisUsername, redisPassword);
  }

  public async get(key: string): Promise<string | null> {
    const memoryHit = await oboMemoryCache.get(key);

    if (memoryHit !== null) {
      return memoryHit.token;
    }

    const redisHit = await this.oboRedisCache.get(key);

    if (redisHit !== null) {
      oboMemoryCache.set(key, redisHit.token, redisHit.expiresAt);

      return redisHit.token;
    }

    return null;
  }

  public async set(key: string, token: string, expiresAt: number): Promise<void> {
    await Promise.all([oboMemoryCache.set(key, token, expiresAt), this.oboRedisCache.set(key, token, expiresAt)]);
  }
}

class OboSimpleCache {
  public async get(key: string): Promise<string | null> {
    const memoryHit = await oboMemoryCache.get(key);

    return memoryHit?.token ?? null;
  }

  public async set(key: string, token: string, expiresAt: number): Promise<void> {
    await oboMemoryCache.set(key, token, expiresAt);
  }
}

const hasRedis = REDIS_URI !== undefined && REDIS_USERNAME !== undefined && REDIS_PASSWORD !== undefined;

export const oboCache = hasRedis ? new OboTieredCache(REDIS_URI, REDIS_USERNAME, REDIS_PASSWORD) : new OboSimpleCache();
