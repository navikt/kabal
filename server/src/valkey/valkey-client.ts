import { createClient } from 'redis';
import { optionalEnvString } from '@/config/env-var';
import { getLogger } from '@/logger';
import type { ValkeyOptions } from '@/valkey/types';

export type ValkeyClientType = ReturnType<typeof createClient>;

const log = getLogger('valkey-client');

/** Nais injects the connection details of each Valkey instance in the app spec, suffixed with the instance name. */
const getInstanceConfig = (instance: string): ValkeyOptions | null => {
  const url = optionalEnvString(`REDIS_URI_${instance}`);
  const username = optionalEnvString(`REDIS_USERNAME_${instance}`);
  const password = optionalEnvString(`REDIS_PASSWORD_${instance}`);

  if (url === undefined || username === undefined || password === undefined) {
    return null;
  }

  return { url, username, password };
};

export const getValkeyConfig = (): ValkeyOptions | null => getInstanceConfig('HOCUSPOCUS');

/** Highlights have their own instance, so they never compete with collaboration documents for memory. */
export const getHighlightsValkeyConfig = (): ValkeyOptions | null => getInstanceConfig('HIGHLIGHTS');

export const createValkeyClient = (options: ValkeyOptions): ValkeyClientType => {
  const client: ValkeyClientType = createClient({ ...options, pingInterval: 30_000 });

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
