import path from 'path';
import { JWK } from 'jose';
import { requiredEnvJson, requiredEnvString, requiredEnvUrl } from './env-var';

export const slack = {
  url: requiredEnvUrl('SLACK_URL', ''),
  channel: '#klage-notifications',
  messagePrefix: `${requiredEnvString('NAIS_APP_NAME', 'kabal-frontend').toUpperCase()} frontend NodeJS -`,
};

export const API_CLIENT_IDS = [
  'kabal-api',
  'kabal-search',
  'kabal-smart-editor-api',
  'kabal-json-to-pdf',
  'kaka-api',
  'kabal-innstillinger',
  'klage-kodeverk-api',
  'kabal-text-templates',
];

const cwd = process.cwd(); // This will be the server folder, as long as the paths in the NPM scripts are not changed.
const serverDirectoryPath = cwd;
const frontendDirectoryPath = path.resolve(serverDirectoryPath, '../frontend');
export const frontendDistDirectoryPath = path.resolve(frontendDirectoryPath, './dist');

export const AZURE_APP_CLIENT_ID = requiredEnvString('AZURE_APP_CLIENT_ID');
export const AZURE_APP_WELL_KNOWN_URL = requiredEnvUrl('AZURE_APP_WELL_KNOWN_URL');
export const AZURE_APP_JWK = requiredEnvJson<JWK>('AZURE_APP_JWK');
export const VERSION = requiredEnvString('VERSION');
export const PORT = requiredEnvString('PORT', '8080');
export const NAIS_CLUSTER_NAME = requiredEnvString('NAIS_CLUSTER_NAME');
export const START_TIME = Date.now();
