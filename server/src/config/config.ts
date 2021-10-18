import path from 'path';
import { getEnvironmentVersion } from './env';
import { requiredEnvString, requiredEnvUrl } from './env-var';

export const slack = {
  url: requiredEnvUrl('SLACK_URL'),
  channel: '#klage-notifications',
  messagePrefix: 'KABAL frontend NodeJS - ',
};

export const KABAL_API_CLIENT_ID = requiredEnvString(
  getEnvironmentVersion(
    'DOWNSTREAM_API_CLIENT_ID_LOCAL',
    'DOWNSTREAM_API_CLIENT_ID_DEV',
    'DOWNSTREAM_API_CLIENT_ID_PROD'
  )
);

export const cwd = process.cwd(); // This will be the server folder, as long as the paths in the NPM scripts are not changed.
export const serverDirectoryPath = cwd;
export const serverDistDirectoryPath = path.resolve(path.dirname(serverDirectoryPath), './dist');
export const frontendDirectoryPath = path.resolve(serverDirectoryPath, '../frontend');
export const frontendDistDirectoryPath = path.resolve(frontendDirectoryPath, './dist');
