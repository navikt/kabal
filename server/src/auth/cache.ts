import { cacheGauge, cacheSizeGauge } from '@app/auth/cache-gauge';
import { getLogger } from '@app/logger';

const log = getLogger('obo-cache');

type Value = [string, number];

export class OboMemoryCache {
  private cache: Map<string, Value> = new Map();

  constructor() {
    /**
     * Clean OBO token cache every 10 minutes.
     * OBO tokens expire after 1 hour.
     */
    setInterval(() => this.clean(), 10 * 60 * 1000); // 10 minutes.
  }

  public async get(key: string): Promise<string | null> {
    const value = this.cache.get(key);

    if (value === undefined) {
      cacheGauge.inc({ hit: 'miss' });

      return null;
    }

    const [token, expiresAt] = value;

    if (expiresAt <= now()) {
      cacheGauge.inc({ hit: 'expired' });
      this.cache.delete(key);
      cacheSizeGauge.set(this.cache.size);

      return null;
    }

    cacheGauge.inc({ hit: 'hit' });

    return token;
  }

  public async set(key: string, token: string, expiresAt: number) {
    this.cache.set(key, [token, expiresAt]);
    cacheSizeGauge.set(this.cache.size);
  }

  private all() {
    return Array.from(this.cache.entries());
  }

  private clean() {
    const before = this.cache.size;
    const timestamp = now();

    const deleted: number = this.all()
      .map(([key, [, expires_at]]) => {
        if (expires_at <= timestamp) {
          return this.cache.delete(key);
        }

        return false;
      })
      .filter((d) => d).length;

    const after = this.cache.size;
    cacheSizeGauge.set(after);

    if (deleted === 0) {
      log.debug({ msg: `Cleaned the OBO token cache. No expired tokens found. Cache had ${before} tokens.` });

      return;
    }

    log.debug({
      msg: `Cleaned the OBO token cache. Deleted ${deleted} expired tokens. Cache had ${before} tokens, ${after} remaining.`,
    });
  }
}

const now = () => Math.ceil(Date.now() / 1_000);

export const oboCache = new OboMemoryCache();
