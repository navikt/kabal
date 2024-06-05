/* eslint-disable import/no-unused-modules */
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { jest, mock } from 'bun:test';
import { IUserData } from './types/bruker';
import { CountryCode, PostalCode } from './types/common';

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
}));
