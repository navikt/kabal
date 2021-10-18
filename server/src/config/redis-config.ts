import { optionalEnvString, requiredEnvNumber, requiredEnvString } from './env-var';

export const redisConfig = {
  url: requiredEnvString('REDIS_SERVICE'),
  host: optionalEnvString('REDIS_HOST'),
  port: requiredEnvNumber('REDIS_PORT'),
};
