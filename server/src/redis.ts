import { createClient } from 'redis';
import { redisConfig } from './config/redis-config';

const client = createClient(redisConfig.url, {
  db: 1,
});

client.on('error', (error: Error) => {
  console.error('Redis Client error:', error);
});

export const serializeToRedis = <T>(key: string, value: T) => {
  const serialized = JSON.stringify(value);
  return saveToRedis(key, serialized);
};

export const deserializeFromRedis = async <T>(key: string): Promise<T | null> => {
  const serialized = await readFromRedis(key);
  if (serialized === null) {
    return null;
  }
  return JSON.parse(serialized);
};

export const saveToRedis = (key: string, value: string) =>
  new Promise<void>((resolve, reject) =>
    client.set(key, value, (err) => {
      if (err === null) {
        resolve();
      } else {
        console.warn(`Error while saving to Redis with '${key}'`, err);
        reject(err);
      }
    })
  );

export const readFromRedis = async (key: string): Promise<string | null> =>
  new Promise<string | null>((resolve, reject) =>
    client.get(key, (err, json) => {
      if (typeof json === 'string') {
        resolve(json);
      } else if (err === null) {
        resolve(null);
      } else {
        console.warn(`Error while reading from Redis with key '${key}'`, err);
        reject(err);
      }
    })
  );

export const deleteFromRedis = async (key: string): Promise<void> =>
  new Promise<void>((resolve, reject) =>
    client.del(key, (err) => {
      if (err === null) {
        resolve();
      } else {
        console.warn(`Error while deleting from Redis with key '${key}'`, err);
        reject(err);
      }
    })
  );

export interface SessionData {
  before_login?: string;
  access_token?: string;
  refresh_token?: string;
  code_verifier?: string;
}

export const saveSessionData = (sessionId: string, sessionData: SessionData) =>
  serializeToRedis(sessionId, sessionData);
export const getSessionData = (sessionId: string): Promise<SessionData | null> =>
  deserializeFromRedis<SessionData>(sessionId);
