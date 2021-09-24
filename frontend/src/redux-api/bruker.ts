import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

export interface IUser {
  navIdent: string;
  azureId: string;
  fornavn: string;
  etternavn: string;
  sammensattNavn: string;
  epost: string;
}

export interface IEnhet {
  id: string;
  navn: string;
  lovligeTemaer: string[];
}

export interface ISettings {
  hjemler: string[];
  temaer: string[];
  typer: string[];
}

export interface IUserData {
  info: IUser;
  roller: string[];
  enheter: IEnhet[];
  valgtEnhetView: IEnhet;
  innstillinger: ISettings;
}

export interface ISetEnhet {
  enhetId: string;
  navIdent: string;
}

export const brukerApi = createApi({
  reducerPath: 'brukerApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['valgtEnhet'],
  endpoints: (builder) => ({
    getBruker: builder.query<IUserData, void>({
      query: () => '/api/me/brukerdata',
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

export const { useGetBrukerQuery, useSetValgtEnhetMutation } = brukerApi;
