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

export interface PersonSoekApiResponse {
  antallTreffTotalt: number;
  personer: IPersonResultat[];
}

// interface TildelSaksbehandlerResponse {
//   klagebehandlingVersjon: number;
//   modified: Date;
//   tildelt: string;
// }

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

export interface IPersonResultat {
  aapneKlagebehandlinger: IKlagebehandling[];
  avsluttedeKlagebehandlinger: IKlagebehandling[];
  fnr: string;
  foedselsdato: string;
  klagebehandlinger: IKlagebehandling[];
  navn: string;
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

export interface LoadPersonSoekParams {
  navIdent: string;
  antall: number;
  start: number;
  fnr: string;
  soekString: string;
}

export const klagebehandlingerApi = createApi({
  reducerPath: 'klagebehandlingerApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['oppgaver', 'medutgaattefrister', 'personsoek'],
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
    // personsoek er POST for å ikke sende fnr inn i URLen/accesslogger
    personsoek: builder.mutation<PersonSoekApiResponse, LoadPersonSoekParams>({
      query: ({ navIdent, ...queryParams }) => ({
        url: `/api/ansatte/${navIdent}/klagebehandlinger/personsoek`,
        method: 'POST',
        body: queryParams,
        validateStatus: ({ ok }) => ok,
        responseHandler: 'json',
      }),
      invalidatesTags: ['personsoek'],
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
  usePersonsoekMutation,
  useTildelSaksbehandlerMutation,
  useFradelSaksbehandlerMutation,
} = klagebehandlingerApi;
