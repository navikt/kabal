import { getLogger } from '@app/logger';
import { Redis } from '@hocuspocus/extension-redis';
import { optionalEnvString } from '@app/config/env-var';
import { createClient } from 'redis';

const log = getLogger('collaboration');

const REDIS_URI = optionalEnvString('REDIS_URI_COLLABORATION');
const REDIS_USERNAME = optionalEnvString('REDIS_USERNAME_COLLABORATION');
const REDIS_PASSWORD = optionalEnvString('REDIS_PASSWORD_COLLABORATION');

export const getRedisExtension = () => {
  const hasRedis = REDIS_URI !== undefined && REDIS_USERNAME !== undefined && REDIS_PASSWORD !== undefined;

  if (!hasRedis) {
    log.info({ msg: 'No collaboration Redis connection configured' });

    return null;
  }

  log.info({ msg: 'Collaboration Redis connection configured' });

  return new Redis({
    createClient: () =>
      createClient({
        url: REDIS_URI,
        username: REDIS_USERNAME,
        password: REDIS_PASSWORD,
        pingInterval: 3_000,
      }),
  });
};
