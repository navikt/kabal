import { optionalEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';
import { Redis as RedisExtension } from '@hocuspocus/extension-redis';
import { Redis } from 'ioredis';

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

  return new RedisExtension({ redis: new Redis(REDIS_URI, { password: REDIS_PASSWORD, username: REDIS_USERNAME }) });
};
