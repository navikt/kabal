import { jest, mock } from 'bun:test';
import { GlobalRegistrator } from '@happy-dom/global-registrator';
import React from 'react';

// styled-components CJS bundle references global `React.createContext` instead of using its local require("react").
// This is needed for @styled-icons/fluentui-system-regular which depends on styled-components via @styled-icons/styled-icon.
globalThis.React = React;

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
