import path from 'path';
import { JWK } from 'jose';
import { requiredEnvJson, requiredEnvString } from './env-var';
import { isLocal } from '@app/config/env';

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

const defaultValue = isLocal ? 'local' : undefined;
const localJwk: JWK = {};

export const AZURE_APP_CLIENT_ID = requiredEnvString('AZURE_APP_CLIENT_ID', defaultValue);
export const AZURE_APP_WELL_KNOWN_URL = requiredEnvString('AZURE_APP_WELL_KNOWN_URL', defaultValue);
export const AZURE_APP_JWK = requiredEnvJson<JWK>('AZURE_APP_JWK', localJwk);
export const PROXY_VERSION = requiredEnvString('VERSION', defaultValue);
export const PORT = requiredEnvString('PORT', '8080');
export const NAIS_CLUSTER_NAME = requiredEnvString('NAIS_CLUSTER_NAME', defaultValue);
export const START_TIME = Date.now();

let isReady = false;

export const setIsReady = () => {
  isReady = true;
};

export const getIsReady = () => isReady;
