import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { staggeredBaseQuery } from './common';

export type Date = string; // LocalDate

export interface ApiResponse {
  antallTreffTotalt: number;
  klagebehandlinger: IKlagebehandling[];
}

interface UtgaatteApiResponse {
  antall: number;
}

export interface Person {
  navn: string;
  fnr: string;
}

export interface IKlagebehandling {
  id: string;
  person: Person | null;
  type: string;
  tema: string;
  hjemmel: string;
  frist: Date;
  mottatt: Date;
  versjon: number;
  klagebehandlingVersjon: number;
  erMedunderskriver: boolean;
  harMedunderskriver: boolean;
  medunderskriverident: string | null;
  utfall: string | null;
  avsluttetAvSaksbehandler: string | null;
  erTildelt: boolean;
  tildeltSaksbehandlerident: string | null;
  tildeltSaksbehandlerNavn: string | null;
  saksbehandlerHarTilgang: boolean;
  egenAnsatt: boolean;
  fortrolig: boolean;
  strengtFortrolig: boolean;
  ageKA: number; // Age in days.
}

export interface LoadKlagebehandlingerParams {
  start: number;
  antall: number;
  sortering: 'FRIST';
  rekkefoelge: 'STIGENDE' | 'SYNKENDE';
  erTildeltSaksbehandler: boolean;
  temaer: string[];
  typer: string[];
  hjemler: string[];
  navIdent: string;
  ferdigstiltFom?: Date;
  tildeltSaksbehandler?: string;
  projeksjon?: 'UTVIDET';
}

export interface TildelSaksbehandlerParams {
  navIdent: string;
  enhetId: string;
  klagebehandlingVersjon: number;
  oppgaveId: string;
}

export interface FradelSaksbehandlerParams {
  navIdent: string;
  enhetId: string;
  klagebehandlingVersjon: number;
  oppgaveId: string;
}

interface TildelSaksbehandlerResponse {
  klagebehandlingVersjon: number;
  modified: Date;
  tildelt: string;
}

export const klagebehandlingerApi = createApi({
  reducerPath: 'klagebehandlingerApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['oppgaver', 'medutgaattefrister'],
  endpoints: (builder) => ({
    getKlagebehandlinger: builder.query<ApiResponse, LoadKlagebehandlingerParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/ansatte/${navIdent}/klagebehandlinger?${query}`;
      },
      providesTags: (result) =>
        typeof result !== 'undefined'
          ? [
              ...result.klagebehandlinger.map(({ id }) => ({ type: 'oppgaver', id } as const)),
              { type: 'oppgaver', id: 'LIST' },
            ]
          : [{ type: 'oppgaver', id: 'LIST' }],
    }),
    getAntallKlagebehandlingerMedUtgaatteFrister: builder.query<UtgaatteApiResponse, LoadKlagebehandlingerParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/ansatte/${navIdent}/antallklagebehandlingermedutgaattefrister?${query}`;
      },
      providesTags: ['medutgaattefrister'],
    }),
    tildelSaksbehandler: builder.mutation<string, TildelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent, ...params }) => ({
        url: `/api/ansatte/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlertildeling`,
        method: 'POST',
        body: { navIdent, ...params },
        validateStatus: ({ ok }) => ok,
        responseHandler: async (): Promise<string> => oppgaveId,
      }),
      invalidatesTags: (oppgaveId) =>
        typeof oppgaveId !== 'undefined' ? [{ type: 'oppgaver', id: oppgaveId }] : [{ type: 'oppgaver', id: 'LIST' }],
    }),
    fradelSaksbehandler: builder.mutation<string, FradelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent, ...params }) => ({
        url: `/api/ansatte/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlerfradeling`,
        method: 'POST',
        body: { navIdent, ...params },
        validateStatus: ({ ok }) => ok,
        responseHandler: async (): Promise<string> => oppgaveId,
      }),
      invalidatesTags: (oppgaveId) =>
        typeof oppgaveId !== 'undefined' ? [{ type: 'oppgaver', id: oppgaveId }] : [{ type: 'oppgaver', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetKlagebehandlingerQuery,
  useGetAntallKlagebehandlingerMedUtgaatteFristerQuery,
  useTildelSaksbehandlerMutation,
  useFradelSaksbehandlerMutation,
} = klagebehandlingerApi;
