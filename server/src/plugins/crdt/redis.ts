import { optionalEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';
import { RedisExtension } from '@app/plugins/crdt/redis-extension/redis-extension';

const log = getLogger('collaboration');

const REDIS_NAME = 'BB7372D9_356F_4458_9F0C_D3589599E554';

const REDIS_URI = optionalEnvString(`REDIS_URI_${REDIS_NAME}`);
const REDIS_USERNAME = optionalEnvString(`REDIS_USERNAME_${REDIS_NAME}`);
const REDIS_PASSWORD = optionalEnvString(`REDIS_PASSWORD_${REDIS_NAME}`);

export const getRedisExtension = () => {
  const hasRedis = REDIS_URI !== undefined && REDIS_USERNAME !== undefined && REDIS_PASSWORD !== undefined;

  if (!hasRedis) {
    log.info({ msg: 'No collaboration Redis connection configured' });

    return null;
  }

  log.info({ msg: 'Collaboration Redis connection configured' });

  return new RedisExtension({
    url: REDIS_URI,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
  });
};