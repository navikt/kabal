import { memoryCacheGauge, memoryCacheSizeGauge } from '@app/auth/cache/cache-gauge';
import { TokenMessage } from '@app/auth/cache/types';
import { getLogger } from '@app/logger';

const log = getLogger('obo-memory-cache');

type Value = [string, number];

export class OboMemoryCache {
  #cache: Map<string, Value>;

  constructor(tokenMessages: TokenMessage[]) {
    this.#cache = new Map<string, Value>(
      tokenMessages.map((tokenMessage) => [tokenMessage.key, [tokenMessage.token, tokenMessage.expiresAt]]),
    );

    log.info({ msg: `Created OBO memory cache with ${tokenMessages.length} tokens.` });

    /**
     * Clean OBO token cache every 10 minutes.
     * OBO tokens expire after 1 hour.
     */
    setInterval(() => this.#clean(), 10 * 60 * 1_000);
  }

  public get(key: string) {
    const value = this.#cache.get(key);

    if (value === undefined) {
      memoryCacheGauge.inc({ hit: 'miss' });

      return null;
    }

    const [token, expiresAt] = value;

    if (expiresAt <= now()) {
      memoryCacheGauge.inc({ hit: 'expired' });
      this.#cache.delete(key);
      memoryCacheSizeGauge.set(this.#cache.size);

      return null;
    }

    memoryCacheGauge.inc({ hit: 'hit' });

    return { token, expiresAt };
  }

  public set(key: string, token: string, expiresAt: number) {
    this.#cache.set(key, [token, expiresAt]);
    memoryCacheSizeGauge.set(this.#cache.size);
  }

  #all() {
    return Array.from(this.#cache.entries());
  }

  #clean() {
    const before = this.#cache.size;
    const timestamp = now();

    const deleted: number = this.#all()
      .map(([key, [, expires_at]]) => {
        if (expires_at <= timestamp) {
          return this.#cache.delete(key);
        }

        return false;
      })
      .filter((d) => d).length;

    const after = this.#cache.size;
    memoryCacheSizeGauge.set(after);

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
