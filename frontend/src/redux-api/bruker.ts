import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

export interface IBruker {
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

export interface IEnhet {
  id: string;
  navn: string;
  lovligeTemaer: string[];
}

interface ISetEnhet {
  enhetId: string;
  navIdent: string;
}

export const brukerApi = createApi({
  reducerPath: 'brukerApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['valgtEnhet'],
  endpoints: (builder) => ({
    getBruker: builder.query<IBruker, void>({
      query: () => '/api/me/brukerdata',
    }),
    getEnheter: builder.query<IEnhet[], string>({
      query: (navIdent) => `/api/ansatte/${navIdent}/enheter`,
    }),
    getValgtEnhet: builder.query<IEnhet, string>({
      query: (navIdent) => `/api/ansatte/${navIdent}/valgtenhet`,
      providesTags: ['valgtEnhet'],
    }),
    setValgtEnhet: builder.mutation<void, ISetEnhet>({
      query: ({ navIdent, enhetId }) => ({
        url: `/api/ansatte/${navIdent}/valgtenhet`,
        method: 'PUT',
        body: { enhetId },
      }),
      invalidatesTags: ['valgtEnhet'],
    }),
  }),
});

export const {
  useGetBrukerQuery,
  useGetEnheterQuery,
  useGetValgtEnhetQuery,
  useLazyGetValgtEnhetQuery,
  useLazyGetEnheterQuery,
  useSetValgtEnhetMutation,
} = brukerApi;
