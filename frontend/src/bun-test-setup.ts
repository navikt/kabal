import { jest, mock } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import type { IUserData } from './types/bruker';
import type { CountryCode, PostalCode } from './types/common';

GlobalRegistrator.register();

const user: Promise<IUserData> = Promise.resolve({
  navIdent: '',
  navn: '',
  roller: [],
  enheter: [],
  tildelteYtelser: [],
  ansattEnhet: {
    id: '',
    navn: '',
    lovligeYtelser: [],
  },
});

const countryCodes: Promise<CountryCode[]> = Promise.resolve([]);
const postalCodes: Promise<PostalCode[]> = Promise.resolve([]);

mock.module('@app/static-data/static-data', () => ({
  user,
  countryCodes,
  postalCodes,
}));

mock.module('@app/observability', () => ({
  pushError: jest.fn(),
  pushLog: jest.fn(),
  pushEvent: jest.fn(),
  usePushEvent: jest.fn(),
}));

mock.module('@app/environment', () => ({
  ENVIRONMENT: {
    isProduction: false,
    isDevelopment: false,
    isLocal: false,
    version: '1.0.0',
  },
}));
