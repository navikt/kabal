import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { Name } from '../domain/types';
import { staggeredBaseQuery } from './common';
import { MedunderskriverFlyt } from './oppgave-state-types';

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
  ageKA: number; // Age in days.
  avsluttetAvSaksbehandlerDate: Date | null;
  egenAnsatt: boolean;
  erMedunderskriver: boolean;
  erTildelt: boolean;
  fortrolig: boolean;
  frist: Date;
  harMedunderskriver: boolean;
  hjemmel: string;
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriverFlyt: MedunderskriverFlyt;
  medunderskriverident: string | null;
  mottatt: Date;
  person: Person | null;
  saksbehandlerHarTilgang: boolean;
  strengtFortrolig: boolean;
  tema: string;
  tildeltSaksbehandlerident: string | null;
  tildeltSaksbehandlerNavn: string | null;
  type: string;
  ytelse: string;
  utfall: string | null;
}

export type IKlagebehandlingList = IKlagebehandling[];

export interface LoadKlagebehandlingerParams {
  start: number;
  antall: number;
  sortering: 'FRIST';
  rekkefoelge: 'STIGENDE' | 'SYNKENDE';
  erTildeltSaksbehandler: boolean;
  ytelser?: string[];
  typer?: string[];
  hjemler?: string[];
  navIdent: string;
  ferdigstiltFom?: Date;
  ferdigstiltDaysAgo?: number;
  tildeltSaksbehandler?: string;
  projeksjon?: 'UTVIDET';
  enhet: string | null;
}

export interface TildelSaksbehandlerParams {
  navIdent: string;
  enhetId: string;
  oppgaveId: string;
}

export interface FradelSaksbehandlerParams {
  navIdent: string;
  oppgaveId: string;
}

export interface ISaksbehandlerResponse {
  modified: string;
  tildelt: string;
}

export interface IFnrSearchParams {
  enhet: string;
  query: string;
}

export interface IFnrSearchResponse {
  fnr: string;
  navn: Name;
  aapneKlagebehandlinger: IKlagebehandlingList;
  avsluttedeKlagebehandlinger: IKlagebehandlingList;
  klagebehandlinger: IKlagebehandlingList;
}

export interface INameSearchParams {
  antall: number;
  query: string;
  start: number;
}

export interface INameSearchResponse {
  people: {
    fnr: string;
    navn: Name;
  }[];
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
        return `/api/kabal-search/ansatte/${navIdent}/klagebehandlinger?${query}`;
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
        return `/api/kabal-search/ansatte/${navIdent}/antallklagebehandlingermedutgaattefrister?${query}`;
      },
      providesTags: ['medutgaattefrister'],
    }),
    fnrSearch: builder.query<IFnrSearchResponse | undefined, IFnrSearchParams>({
      query: ({ ...queryParams }) => ({
        url: `/api/kabal-search/search/fnr`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: queryParams,
      }),
    }),
    nameSearch: builder.query<INameSearchResponse, INameSearchParams>({
      query: ({ ...queryParams }) => ({
        url: `/api/kabal-search/search/name`,
        method: 'POST',
        body: queryParams,
      }),
    }),
    tildelSaksbehandler: builder.mutation<ISaksbehandlerResponse, TildelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent, enhetId }) => ({
        url: `/api/kabal-api/ansatte/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlertildeling`,
        method: 'POST',
        body: {
          navIdent,
          enhetId,
        },
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        await delay(3000);
        dispatch(
          klagebehandlingerApi.util.invalidateTags([
            {
              type: 'oppgaver',
              id: oppgaveId,
            },
          ])
        );
      },
    }),
    fradelSaksbehandler: builder.mutation<ISaksbehandlerResponse, FradelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/api/kabal-api/ansatte/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlerfradeling`,
        method: 'POST',
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        await delay(3000);
        dispatch(
          klagebehandlingerApi.util.invalidateTags([
            {
              type: 'oppgaver',
              id: oppgaveId,
            },
          ])
        );
      },
      // invalidatesTags: (res, err, { oppgaveId }) => [{ type: 'oppgaver', id: oppgaveId }],
    }),
  }),
});

export const {
  useGetKlagebehandlingerQuery,
  useGetAntallKlagebehandlingerMedUtgaatteFristerQuery,
  useTildelSaksbehandlerMutation,
  useFradelSaksbehandlerMutation,
  useFnrSearchQuery,
  useNameSearchQuery,
} = klagebehandlingerApi;

const delay = async (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
