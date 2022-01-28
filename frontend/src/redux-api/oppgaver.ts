import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import {
  ApiResponse,
  EnhetensFerdigstilteOppgaverParams,
  EnhetensUferdigeOppgaverParams,
  IGetSaksbehandlereInEnhetResponse,
  INameSearchParams,
  INameSearchResponse,
  IPersonAndOppgaverResponse,
  MineFerdigstilteOppgaverParams,
  MineLedigeOppgaverParams,
  MineUferdigeOppgaverParams,
  UtgaatteApiResponse,
  UtgaatteOppgaverParams,
} from '../types/oppgaver';
import { SEARCH_BASE_QUERY } from './common';

export const oppgaverApi = createApi({
  reducerPath: 'oppgaverApi',
  baseQuery: SEARCH_BASE_QUERY,
  tagTypes: ['tildelte-oppgaver', 'ledige-oppgaver', 'ledige-medutgaattefrister'],
  endpoints: (builder) => ({
    getMineFerdigstilteOppgaver: builder.query<ApiResponse, MineFerdigstilteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/ansatte/${navIdent}/oppgaver/ferdigstilte?${query}`;
      },
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/ansatte/${navIdent}/oppgaver/uferdige?${query}`;
      },
      providesTags: ['tildelte-oppgaver'],
    }),
    getMineLedigeOppgaver: builder.query<ApiResponse, MineLedigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/ansatte/${navIdent}/oppgaver/ledige?${query}`;
      },
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensFerdigstilteOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte?${query}`;
      },
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/enhet/${enhetId}/oppgaver/tildelte/uferdige?${query}`;
      },
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, UtgaatteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/ansatte/${navIdent}/antalloppgavermedutgaattefrister?${query}`;
      },
      providesTags: ['ledige-medutgaattefrister'],
    }),
    nameSearch: builder.query<INameSearchResponse, INameSearchParams>({
      query: ({ ...queryParams }) => ({
        url: `/search/name`,
        method: 'POST',
        body: queryParams,
      }),
    }),
    personAndOppgaver: builder.query<IPersonAndOppgaverResponse, string>({
      query: (query) => ({
        url: `/search/personogoppgaver`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { query },
      }),
    }),
    getSaksbehandlereInEnhet: builder.query<IGetSaksbehandlereInEnhetResponse, string>({
      query: (enhet) => `/enheter/${enhet}/saksbehandlere`,
    }),
    rebuildElasticAdmin: builder.mutation<void, void>({
      query: () => ({
        url: `/internal/elasticadmin/rebuild`,
        method: 'POST',
      }),
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
  usePersonAndOppgaverQuery,
  useNameSearchQuery,
  useGetSaksbehandlereInEnhetQuery,
  useRebuildElasticAdminMutation,
} = oppgaverApi;
