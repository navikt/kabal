import path from 'path';
import { requiredEnvUrl } from './env-var';

export const slack = {
  url: requiredEnvUrl('SLACK_URL'),
  channel: '#klage-notifications',
  messagePrefix: 'KABAL frontend NodeJS - ',
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
