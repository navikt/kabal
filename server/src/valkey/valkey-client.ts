import { optionalEnvString } from '@app/config/env-var';
import { getLogger } from '@app/logger';
import type { ValkeyOptions } from '@app/valkey/types';
import { createClient } from 'redis';

export type ValkeyClientType = ReturnType<typeof createClient>;

const log = getLogger('valkey-client');

const VALKEY_URI = optionalEnvString('REDIS_URI_HOCUSPOCUS');
const VALKEY_USERNAME = optionalEnvString('REDIS_USERNAME_HOCUSPOCUS');
const VALKEY_PASSWORD = optionalEnvString('REDIS_PASSWORD_HOCUSPOCUS');

export const getValkeyConfig = (): ValkeyOptions | null => {
  if (VALKEY_URI === undefined || VALKEY_USERNAME === undefined || VALKEY_PASSWORD === undefined) {
    return null;
  }

  return { url: VALKEY_URI, username: VALKEY_USERNAME, password: VALKEY_PASSWORD };
};

export const createValkeyClient = (options: ValkeyOptions): ValkeyClientType => {
  const client = createClient({ ...options, pingInterval: 30_000 });

  client.on('error', (error) => log.error({ msg: 'Valkey client error', error }));

  return client;
};

let singletonClient: ValkeyClientType | null = null;

export const getValkeyClient = async (): Promise<ValkeyClientType> => {
  if (singletonClient !== null) {
    return singletonClient;
  }

  const config = getValkeyConfig();

  if (config === null) {
    log.error({ msg: 'No Valkey connection configured' });
    throw new Error('No Valkey connection configured');
  }

  singletonClient = createValkeyClient(config);
  await singletonClient.connect();

  log.info({ msg: 'Valkey client connected' });

  return singletonClient;
};
