import { OboMemoryCache } from '@app/auth/cache/memory-cache';
import { OboPersistentCache } from '@app/auth/cache/persistent-cache';
import { optionalEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';

const VALKEY_URI = optionalEnvString('REDIS_URI_OBO_CACHE_KABAL');
const VALKEY_USERNAME = optionalEnvString('REDIS_USERNAME_OBO_CACHE_KABAL');
const VALKEY_PASSWORD = optionalEnvString('REDIS_PASSWORD_OBO_CACHE_KABAL');

const log = getLogger('obo-cache');

class OboTieredCache {
  #oboPersistentCache: OboPersistentCache;
  #oboMemoryCache: OboMemoryCache | null = null;
  #isReady = false;

  constructor(valkeyUri: string, valkeyUsername: string, valkeyPassword: string) {
    this.#oboPersistentCache = new OboPersistentCache(valkeyUri, valkeyUsername, valkeyPassword);
    this.#init().catch((error) => {
      log.error({ msg: 'Failed to initialize OBO cache:', error, data: { valkeyUri, valkeyUsername } });
    });
  }

  async #init() {
    await this.#oboPersistentCache.init();
    const allTokenMessages = await this.#oboPersistentCache.getAll();
    const oboMemoryCache = new OboMemoryCache(allTokenMessages);
    this.#oboMemoryCache = oboMemoryCache;
    this.#oboPersistentCache.addTokenListener(({ key, token, expiresAt }) => oboMemoryCache.set(key, token, expiresAt));
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

    const persistentHit = await this.#oboPersistentCache.get(key);

    if (persistentHit !== null) {
      this.#oboMemoryCache.set(key, persistentHit.token, persistentHit.expiresAt);

      return persistentHit.token;
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
    await this.#oboPersistentCache.set(key, token, expiresAt);
  }

  public get isReady(): boolean {
    return this.#isReady && this.#oboPersistentCache.isReady;
  }
}

class OboSimpleCache {
  #oboMemoryCache = new OboMemoryCache([]);

  public get(key: string): string | null {
    const memoryHit = this.#oboMemoryCache.get(key);

    return memoryHit?.token ?? null;
  }

  public getCached = this.get;

  public set(key: string, token: string, expiresAt: number): Promise<void> {
    this.#oboMemoryCache.set(key, token, expiresAt);

    return Promise.resolve();
  }

  public get isReady(): boolean {
    return true;
  }
}

const hasValkey = VALKEY_URI !== undefined && VALKEY_USERNAME !== undefined && VALKEY_PASSWORD !== undefined;

export const oboCache = hasValkey
  ? new OboTieredCache(VALKEY_URI, VALKEY_USERNAME, VALKEY_PASSWORD)
  : new OboSimpleCache();

export const getCacheKey = (navIdent: string, appName: string) => `${navIdent}-${appName}`;
