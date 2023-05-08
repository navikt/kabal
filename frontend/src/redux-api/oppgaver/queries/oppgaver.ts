import { queryStringify } from '@app/functions/query-string';
import {
  ApiResponse,
  EnhetensFerdigstilteOppgaverParams,
  EnhetensUferdigeOppgaverParams,
  INameSearchParams,
  INameSearchResponse,
  IPersonAndOppgaverResponse,
  IPersonAndOppgaverResponseOld,
  ISaksbehandlere,
  LedigeOppgaverParams,
  MineFerdigstilteOppgaverParams,
  MineUferdigeOppgaverParams,
  UtgaatteApiResponse,
  UtgaatteOppgaverParams,
} from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

interface OldApiResponse {
  behandlinger: { id: string }[];
  antallTreffTotalt: number;
}

const transformResponse = ({ behandlinger, ...rest }: OldApiResponse) => ({
  behandlinger: behandlinger.map(({ id }) => id),
  ...rest,
});

const oppgaverQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getMineFerdigstilteOppgaver: builder.query<ApiResponse, MineFerdigstilteOppgaverParams>({
      transformResponse,
      query: (queryParams) => `/kabal-search/oppgaver/ferdigstilte${queryStringify(queryParams)}`,
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      transformResponse,
      query: (queryParams) => `/kabal-search/oppgaver/uferdige${queryStringify(queryParams)}`,
    }),
    getMineVentendeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      transformResponse,
      query: (queryParams) => `/kabal-search/oppgaver/paavent${queryStringify(queryParams)}`,
    }),
    getLedigeOppgaver: builder.query<ApiResponse, LedigeOppgaverParams>({
      transformResponse,
      query: (queryParams) => `/kabal-search/oppgaver/ledige${queryStringify(queryParams)}`,
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensFerdigstilteOppgaverParams>({
      transformResponse,
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte_new${queryStringify(queryParams)}`,
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      transformResponse,
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige_new${queryStringify(queryParams)}`,
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      transformResponse,
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/paavent_new${queryStringify(queryParams)}`,
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, UtgaatteOppgaverParams>({
      query: (queryParams) => `/kabal-search/antalloppgavermedutgaattefrister${queryStringify(queryParams)}`,
    }),
    nameSearch: builder.query<INameSearchResponse, INameSearchParams>({
      query: (body) => ({ url: `/kabal-search/search/name`, method: 'POST', body }),
    }),
    personAndOppgaver: builder.query<IPersonAndOppgaverResponse, string>({
      query: (query) => ({
        url: `/kabal-search/search/personogoppgaver`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { query },
      }),
      transformResponse: ({ aapneBehandlinger, avsluttedeBehandlinger, fnr, navn }: IPersonAndOppgaverResponseOld) => ({
        aapneBehandlinger: aapneBehandlinger.map(({ id }) => id),
        avsluttedeBehandlinger: avsluttedeBehandlinger.map(({ id }) => id),
        fnr,
        navn,
      }),
    }),
    getSaksbehandlereInEnhet: builder.query<ISaksbehandlere, string>({
      query: (enhet) => `/kabal-search/enheter/${enhet}/saksbehandlere`,
    }),
  }),
});

export const {
  useGetEnhetensUferdigeOppgaverQuery,
  useGetEnhetensVentendeOppgaverQuery,
  useGetMineFerdigstilteOppgaverQuery,
  useGetMineUferdigeOppgaverQuery,
  useGetMineVentendeOppgaverQuery,
  useGetLedigeOppgaverQuery,
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  usePersonAndOppgaverQuery,
  useLazyNameSearchQuery,
  useGetSaksbehandlereInEnhetQuery,
} = oppgaverQuerySlice;
