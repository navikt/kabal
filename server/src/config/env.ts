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

export const environmentName = getEnvironmentVersion('local', 'development', 'production');

export const applicationDomain: string = getEnvironmentVersion(
  `http://localhost:${serverConfig.port}`,
  'https://kabal.dev.nav.no',
  'https://kabal.intern.nav.no'
);
