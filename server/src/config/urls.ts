import { optionalEnvString } from './env-var';
import { isDeployedToDev } from './env';

const getDownstreamApiUrl = (): string => {
  const downstream_api = optionalEnvString('DOWNSTREAM_API_URL');
  if (typeof downstream_api === 'string' && downstream_api.length !== 0) {
    return downstream_api;
  }
  if (isDeployedToDev) {
    return 'https://kabal-api.dev.nav.no/';
  }
  return 'https://kabal-api.intern.nav.no/';
};

export const KABAL_API_URL = getDownstreamApiUrl();
