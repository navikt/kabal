import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

interface IBruker {
  id: string;
  '@odata.context': string;
  '@odata.id': string;
  onPremisesSamAccountName: string;
  displayName: string;
  givenName: string;
  mail: string;
  officeLocation: string;
  surname: string;
  userPrincipalName: string;
  jobTitle: string;
}

interface IEnhet {
  id: string;
  navn: string;
  lovligeTemaer: string[];
}

export const brukerApi = createApi({
  reducerPath: 'brukerApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getBruker: builder.query<IBruker, void>({
      query: () => '/me',
    }),
    getEnheter: builder.query<IEnhet[], string>({
      query: (navIdent) => `/ansatte/${navIdent}/enheter`,
    }),
    getValgtEnhet: builder.query<IEnhet, string>({
      query: (navIdent) => `ansatte/${navIdent}/valgtenhet`,
    }),
  }),
});

export const { useGetBrukerQuery, useGetEnheterQuery, useGetValgtEnhetQuery } = brukerApi;
