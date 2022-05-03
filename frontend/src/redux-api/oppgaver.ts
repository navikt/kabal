import { createApi } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { queryStringify } from '../functions/query-string';
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
  tagTypes: [
    'tildelte-oppgaver',
    'ventende-oppgaver',
    'ledige-oppgaver',
    'ledige-medutgaattefrister',
    'enhetens-tildelte-oppgaver',
  ],
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
    getMineVentendeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/ansatte/${navIdent}/oppgaver/paavent?${query}`;
      },
      providesTags: ['ventende-oppgaver'],
    }),
    getMineLedigeOppgaver: builder.query<ApiResponse, MineLedigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);
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
      providesTags: ['enhetens-tildelte-oppgaver'],
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = qs.stringify(queryParams, {
          arrayFormat: 'comma',
          skipNulls: true,
        });
        return `/enhet/${enhetId}/oppgaver/tildelte/paavent?${query}`;
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
  useGetEnhetensVentendeOppgaverQuery,
  useGetMineFerdigstilteOppgaverQuery,
  useGetMineUferdigeOppgaverQuery,
  useGetMineVentendeOppgaverQuery,
  useGetMineLedigeOppgaverQuery,
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  usePersonAndOppgaverQuery,
  useNameSearchQuery,
  useGetSaksbehandlereInEnhetQuery,
  useRebuildElasticAdminMutation,
} = oppgaverApi;
