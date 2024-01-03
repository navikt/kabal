import { requiredEnvString } from './env-var';
import { serverConfig } from './server-config';

const getEnvironmentVersion = <T>(local: T, development: T, production: T): T => {
  if (isDeployedToDev) {
    return development;
  }

  if (isDeployedToProd) {
    return production;
  }

  return local;
};

const isDeployedToDev = serverConfig.cluster === 'dev-gcp';
export const isDeployedToProd = serverConfig.cluster === 'prod-gcp';
export const isDeployed = isDeployedToDev || isDeployedToProd;

export const ENVIRONMENT = getEnvironmentVersion('local', 'development', 'production');

export const DOMAIN: string = getEnvironmentVersion(
  `http://localhost:${serverConfig.port}`,
  'https://kabal.intern.dev.nav.no',
  'https://kabal.intern.nav.no',
);

export const NAIS_NAMESPACE = requiredEnvString('NAIS_NAMESPACE', 'none');
