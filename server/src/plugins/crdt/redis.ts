import { optionalEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';
import { Redis as RedisExtension } from '@hocuspocus/extension-redis';

const log = getLogger('collaboration');

const getPort = (uri: string) => {
  const parts = uri.split(':');

  if (parts === undefined) {
    return undefined;
  }

  const portString = parts[parts.length - 1];

  if (portString === undefined) {
    return undefined;
  }

  return parseInt(portString, 10);
};

const REDIS_NAME = '983BCD82_4667_48D6_AF91_6DF206E87E6F';

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
    host: REDIS_URI,
    port: getPort(REDIS_URI),
    options: {
      username: REDIS_USERNAME,
      password: REDIS_PASSWORD,
    },
  });
};
