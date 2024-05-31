/* eslint-disable import/no-unused-modules */
import { IUserData } from '@app/types/bruker';
import { CountryCode, PostalCode } from '@app/types/common';

export const user: Promise<IUserData> = Promise.resolve({
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

export const countryCodes: Promise<CountryCode[]> = Promise.resolve([]);
export const postalCodes: Promise<PostalCode[]> = Promise.resolve([]);
