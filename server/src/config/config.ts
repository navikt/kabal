import path from 'path';
import { requiredEnvUrl } from './env-var';

export const slack = {
  url: requiredEnvUrl('SLACK_URL'),
  channel: '#klage-notifications',
  messagePrefix: 'KABAL frontend NodeJS - ',
};

export const API_CLIENT_IDS = [
  'kabal-api',
  'kabal-anke-api',
  'kabal-search',
  'kabal-smart-editor-api',
  'kabal-json-to-pdf',
  'kaka-api',
  'kabal-innstillinger',
  'klage-kodeverk-api',
];

export const cwd = process.cwd(); // This will be the server folder, as long as the paths in the NPM scripts are not changed.
export const serverDirectoryPath = cwd;
export const serverDistDirectoryPath = path.resolve(path.dirname(serverDirectoryPath), './dist');
export const frontendDirectoryPath = path.resolve(serverDirectoryPath, '../frontend');
export const frontendDistDirectoryPath = path.resolve(frontendDirectoryPath, './dist');
