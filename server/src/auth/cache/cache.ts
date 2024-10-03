import { OboMemoryCache } from '@app/auth/cache/memory-cache';
import { OboRedisCache } from '@app/auth/cache/redis-cache';
import { optionalEnvString } from '@app/config/env-var';

const REDIS_URI = optionalEnvString('REDIS_URI_OBO_CACHE');
const REDIS_USERNAME = optionalEnvString('REDIS_USERNAME_OBO_CACHE');
const REDIS_PASSWORD = optionalEnvString('REDIS_PASSWORD_OBO_CACHE');

class OboTieredCache {
  #oboRedisCache: OboRedisCache;
  #oboMemoryCache: OboMemoryCache | null = null;
  #isReady = false;

  constructor(redisUri: string, redisUsername: string, redisPassword: string) {
    this.#oboRedisCache = new OboRedisCache(redisUri, redisUsername, redisPassword);
    this.#init();
  }

  async #init() {
    await this.#oboRedisCache.init();
    const allTokenMessages = await this.#oboRedisCache.getAll();
    const oboMemoryCache = new OboMemoryCache(allTokenMessages);
    this.#oboMemoryCache = oboMemoryCache;
    this.#oboRedisCache.addTokenListener(({ key, token, expiresAt }) => oboMemoryCache.set(key, token, expiresAt));
    this.#isReady = true;
  }

  public async get(key: string): Promise<string | null> {
    if (this.#oboMemoryCache === null) {
      return null;
    }

    const memoryHit = this.#oboMemoryCache.get(key);

    if (memoryHit !== null) {
      return memoryHit.token;
    }

    const redisHit = await this.#oboRedisCache.get(key);

    if (redisHit !== null) {
      this.#oboMemoryCache.set(key, redisHit.token, redisHit.expiresAt);

      return redisHit.token;
    }

    return null;
  }

  public getCached(key: string): string | null {
    if (this.#oboMemoryCache === null) {
      return null;
    }

    const memoryHit = this.#oboMemoryCache.get(key);

    return memoryHit?.token ?? null;
  }

  public async set(key: string, token: string, expiresAt: number): Promise<void> {
    this.#oboMemoryCache?.set(key, token, expiresAt);
    await this.#oboRedisCache.set(key, token, expiresAt);
  }

  public get isReady(): boolean {
    return this.#isReady && this.#oboRedisCache.isReady;
  }
}

class OboSimpleCache {
  #oboMemoryCache = new OboMemoryCache([]);

  public get(key: string): string | null {
    const memoryHit = this.#oboMemoryCache.get(key);

    return memoryHit?.token ?? null;
  }

  public getCached = this.get;

  public async set(key: string, token: string, expiresAt: number): Promise<void> {
    this.#oboMemoryCache.set(key, token, expiresAt);
  }

  public get isReady(): boolean {
    return true;
  }
}

const hasRedis = REDIS_URI !== undefined && REDIS_USERNAME !== undefined && REDIS_PASSWORD !== undefined;

export const oboCache = hasRedis ? new OboTieredCache(REDIS_URI, REDIS_USERNAME, REDIS_PASSWORD) : new OboSimpleCache();

export const getCacheKey = (navIdent: string, appName: string) => `${navIdent}-${appName}`;
