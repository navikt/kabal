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
export const isLocal = !isDeployed;

export const ENVIRONMENT = getEnvironmentVersion('local', 'development', 'production');

export const LOCAL_DOMAIN = `localhost:${serverConfig.port}`;
export const LOCAL_URL = `http://${LOCAL_DOMAIN}`;

export const DEV_DOMAIN = 'kabal.intern.dev.nav.no';
export const DEV_URL = `https://${DEV_DOMAIN}`;

export const PROD_DOMAIN = 'kabal.intern.nav.no';
export const PROD_URL = `https://${PROD_DOMAIN}`;

export const DOMAIN: string = getEnvironmentVersion(LOCAL_DOMAIN, DEV_URL, PROD_DOMAIN);
export const URL: string = getEnvironmentVersion(LOCAL_URL, DEV_URL, PROD_URL);

export const NAIS_NAMESPACE = requiredEnvString('NAIS_NAMESPACE', 'none');
