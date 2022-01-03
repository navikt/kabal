import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import {
  ApiResponse,
  EnhetensFerdigstilteOppgaverParams,
  EnhetensUferdigeOppgaverParams,
  FradelSaksbehandlerParams,
  IGetSaksbehandlereInEnhetResponse,
  INameSearchParams,
  INameSearchResponse,
  IPersonAndOppgaverResponse,
  ISaksbehandlerResponse,
  MineFerdigstilteOppgaverParams,
  MineLedigeOppgaverParams,
  MineUferdigeOppgaverParams,
  TildelSaksbehandlerParams,
  UtgaatteApiResponse,
  UtgaatteOppgaverParams,
} from '../types/oppgaver';
import { staggeredBaseQuery } from './common';

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['tildelte-oppgaver', 'ledige-oppgaver', 'ledige-medutgaattefrister'],
  endpoints: (builder) => ({
    getMineFerdigstilteOppgaver: builder.query<ApiResponse, MineFerdigstilteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/ansatte/${navIdent}/oppgaver/ferdigstilte?${query}`;
      },
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/ansatte/${navIdent}/oppgaver/uferdige?${query}`;
      },
      providesTags: ['tildelte-oppgaver'],
    }),
    getMineLedigeOppgaver: builder.query<ApiResponse, MineLedigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/ansatte/${navIdent}/oppgaver/ledige?${query}`;
      },
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensFerdigstilteOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte?${query}`;
      },
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige?${query}`;
      },
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, UtgaatteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/ansatte/${navIdent}/antalloppgavermedutgaattefrister?${query}`;
      },
      providesTags: ['ledige-medutgaattefrister'],
    }),
    nameSearch: builder.query<INameSearchResponse, INameSearchParams>({
      query: ({ ...queryParams }) => ({
        url: `/api/kabal-search/search/name`,
        method: 'POST',
        body: queryParams,
      }),
    }),
    personAndOppgaver: builder.query<IPersonAndOppgaverResponse, string>({
      query: (query) => ({
        url: `/api/kabal-search/search/personogoppgaver`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { query },
      }),
    }),
    getSaksbehandlereInEnhet: builder.query<IGetSaksbehandlereInEnhetResponse, string>({
      query: (enhet) => `/api/kabal-search/enheter/${enhet}/saksbehandlere`,
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
      invalidatesTags: ['tildelte-oppgaver'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        await delay(3000);
        dispatch(oppgaverApi.util.invalidateTags(['ledige-oppgaver']));
      },
    }),
    fradelSaksbehandler: builder.mutation<ISaksbehandlerResponse, FradelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/api/kabal-api/ansatte/${navIdent}/klagebehandlinger/${oppgaveId}/saksbehandlerfradeling`,
        method: 'POST',
      }),
      invalidatesTags: ['ledige-oppgaver'],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled;
        await delay(3000);
        dispatch(oppgaverApi.util.invalidateTags(['tildelte-oppgaver']));
      },
    }),
  }),
});

export const {
  useGetEnhetensFerdigstilteOppgaverQuery,
  useGetEnhetensUferdigeOppgaverQuery,
  useGetMineFerdigstilteOppgaverQuery,
  useGetMineUferdigeOppgaverQuery,
  useGetMineLedigeOppgaverQuery,
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useTildelSaksbehandlerMutation,
  useFradelSaksbehandlerMutation,
  usePersonAndOppgaverQuery,
  useNameSearchQuery,
  useGetSaksbehandlereInEnhetQuery,
} = oppgaverApi;

const delay = async (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
