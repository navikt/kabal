import { requiredEnvNumber, requiredEnvString } from './env-var';

export const redisConfig = {
  url: requiredEnvString('REDIS_SERVICE'),
  port: requiredEnvNumber('REDIS_PORT'),
};
