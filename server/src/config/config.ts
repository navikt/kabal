import path from 'path';
import { JWK } from 'jose';
import { requiredEnvJson, requiredEnvString } from '@app/config/env-var';
import { isLocal } from '@app/config/env';

export enum ApiClientEnum {
  KABAL_API = 'kabal-api',
  KABAL_SEARCH = 'kabal-search',
  KABAL_SMART_EDITOR_API = 'kabal-smart-editor-api',
  KABAL_JSON_TO_PDF = 'kabal-json-to-pdf',
  KAKA_API = 'kaka-api',
  KABAL_INNSTILLINGER = 'kabal-innstillinger',
  KLAGE_KODEVERK_API = 'klage-kodeverk-api',
  KABAL_TEXT_TEMPLATES = 'kabal-text-templates',
}

export const API_CLIENT_IDS = [
  ApiClientEnum.KABAL_API,
  ApiClientEnum.KABAL_SEARCH,
  ApiClientEnum.KABAL_SMART_EDITOR_API,
  ApiClientEnum.KABAL_JSON_TO_PDF,
  ApiClientEnum.KAKA_API,
  ApiClientEnum.KABAL_INNSTILLINGER,
  ApiClientEnum.KLAGE_KODEVERK_API,
  ApiClientEnum.KABAL_TEXT_TEMPLATES,
];

const cwd = process.cwd(); // This will be the server folder, as long as the paths in the NPM scripts are not changed.
const serverDirectoryPath = cwd;
export const frontendDirectoryPath = path.resolve(serverDirectoryPath, '../frontend');
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
