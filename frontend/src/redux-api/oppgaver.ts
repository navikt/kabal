import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { staggeredBaseQuery } from './common';

export type Date = string; // LocalDate

export interface ApiResponse {
  antallTreffTotalt: number;
  klagebehandlinger: IKlagebehandling[];
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
}

interface LoadKlagebehandlingerParams {
  from: number;
  count: number;
  sorting: 'FRIST';
  order: 'STIGENDE' | 'SYNKENDE';
  assigned: boolean;
  unitId: string;
  tema: string[];
  types: string[];
  hjemler: string[];
}

export interface TildelSaksbehandlerParams {
  navIdent: string;
  enhetId: string;
  klagebehandlingVersjon: number;
  oppgaveId: string;
}

export const klagebehandlingerApi = createApi({
  reducerPath: 'klagebehandlingerApi',
  baseQuery: staggeredBaseQuery,
  endpoints: (builder) => ({
    getKlagebehandlinger: builder.query<ApiResponse, LoadKlagebehandlingerParams>({
      query: ({ from, count, sorting, order, assigned, tema, types, hjemler, unitId }) => {
        const query = qs.stringify(
          {
            antall: count,
            start: from,
            sortering: sorting,
            rekkefoelge: order,
            erTildeltSaksbehandler: assigned,
            enhetId: unitId,
            temaer: tema,
            typer: types,
            hjemler,
          },
          {
            arrayFormat: 'comma',
            skipNulls: true,
          }
        );
        return `/ansatte/Z994488/klagebehandlinger?${query}`;
      },
    }),
    tildelSaksbehandler: builder.mutation<TildelSaksbehandlerParams, Partial<TildelSaksbehandlerParams>>({
      query: ({ oppgaveId, ...params }) => ({
        url: `/ansatte/Z994488/klagebehandlinger/${oppgaveId}/saksbehandlertildeling`,
        method: 'POST',
        body: params,
      }),
    }),
  }),
});

export const { useGetKlagebehandlingerQuery, useTildelSaksbehandlerMutation } = klagebehandlingerApi;
