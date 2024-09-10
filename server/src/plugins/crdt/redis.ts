import { optionalEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';
import { RedisExtension } from '@app/plugins/crdt/redis-extension/redis-extension';

const log = getLogger('collaboration');

const REDIS_URI = optionalEnvString('REDIS_URI_HOCUSPOCUS');
const REDIS_USERNAME = optionalEnvString('REDIS_USERNAME_HOCUSPOCUS');
const REDIS_PASSWORD = optionalEnvString('REDIS_PASSWORD_HOCUSPOCUS');

export const getRedisExtension = () => {
  const hasRedis = REDIS_URI !== undefined && REDIS_USERNAME !== undefined && REDIS_PASSWORD !== undefined;

  if (!hasRedis) {
    log.error({ msg: 'No collaboration Redis connection configured' });
    process.exit(1);
  }

  log.info({ msg: 'Collaboration Redis connection configured' });

  return new RedisExtension({
    url: REDIS_URI,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
  });
};
