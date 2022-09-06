import { createClient } from 'redis';
import { redisConfig } from './config/redis-config';
import { getLogger } from './logger';

const log = getLogger('redis');

const client = createClient(redisConfig.url, {
  db: 1,
  port: redisConfig.port,
});

client.on('error', (error: Error) => {
  log.error({ msg: 'Redis Client error', error });
});

const serializeToRedis = <T>(key: string, value: T) => {
  const serialized = JSON.stringify(value);

  return saveToRedis(key, serialized);
};

const deserializeFromRedis = async <T>(key: string): Promise<T | null> => {
  const serialized = await readFromRedis(key);

  if (serialized === null) {
    return null;
  }

  try {
    return JSON.parse(serialized) as T;
  } catch (error) {
    log.warn({ msg: `Failed to parse Redis data for key ${key}`, error });

    return null;
  }
};

const saveToRedis = (key: string, value: string) =>
  new Promise<void>((resolve, reject) =>
    client.set(key, value, (error) => {
      if (error === null) {
        resolve();
      } else {
        log.warn({ msg: `Error while saving to Redis with '${key}'`, error });

        reject(error);
      }
    })
  );

const readFromRedis = async (key: string): Promise<string | null> =>
  new Promise<string | null>((resolve, reject) =>
    client.get(key, (error, json) => {
      if (error !== null) {
        log.warn({ msg: `Error while reading from Redis with key '${key}'`, error });
        reject(error);

        return;
      }

      if (typeof json === 'string') {
        resolve(json);

        return;
      }

      if (error === null) {
        resolve(null);
      }
    })
  );

export const deleteFromRedis = async (key: string): Promise<void> =>
  new Promise<void>((resolve, reject) =>
    client.del(key, (error) => {
      if (error === null) {
        resolve();
      } else {
        log.warn({ msg: `Error while deleting from Redis with key '${key}'`, error });

        reject(error);
      }
    })
  );

interface SessionData {
  before_login?: string;
  access_token?: string;
  refresh_token?: string;
  code_verifier?: string;
}

export const saveSessionData = (sessionId: string, sessionData: SessionData) =>
  serializeToRedis(sessionId, sessionData);
export const getSessionData = (sessionId: string): Promise<SessionData | null> =>
  deserializeFromRedis<SessionData>(sessionId);
