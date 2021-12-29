import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { staggeredBaseQuery } from './common';
import {
  ApiResponse,
  FradelSaksbehandlerParams,
  IFnrSearchParams,
  IFnrSearchResponse,
  IGetSaksbehandlereInEnhetResponse,
  INameSearchParams,
  INameSearchResponse,
  ISaksbehandlerResponse,
  LoadLedigeOppgaverParams,
  LoadTildelteOppgaverParams,
  TildelSaksbehandlerParams,
  UtgaatteApiResponse,
} from './oppgaver-types';

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['tildelte-oppgaver', 'ledige-oppgaver', 'ledige-medutgaattefrister'],
  endpoints: (builder) => ({
    getTildelteOppgaver: builder.query<ApiResponse, LoadTildelteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/ansatte/${navIdent}/klagebehandlinger?erTildeltSaksbehandler=true&${query}`;
      },
      providesTags: ['tildelte-oppgaver'],
    }),
    getLedigeOppgaver: builder.query<ApiResponse, LoadLedigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/ansatte/${navIdent}/klagebehandlinger?erTildeltSaksbehandler=false&${query}`;
      },
      providesTags: ['ledige-oppgaver'],
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, LoadLedigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/api/kabal-search/ansatte/${navIdent}/antallklagebehandlingermedutgaattefrister?erTildeltSaksbehandler=false&${query}`;
      },
      providesTags: ['ledige-medutgaattefrister'],
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
  useGetTildelteOppgaverQuery,
  useGetLedigeOppgaverQuery,
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useTildelSaksbehandlerMutation,
  useFradelSaksbehandlerMutation,
  useFnrSearchQuery,
  useNameSearchQuery,
  useGetSaksbehandlereInEnhetQuery,
} = oppgaverApi;

const delay = async (ms: number): Promise<void> => new Promise((res) => setTimeout(res, ms));
