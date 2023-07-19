import { queryStringify } from '@app/functions/query-string';
import { IPartBase } from '@app/types/oppgave-common';
import {
  ApiResponse,
  CommonOppgaverParams,
  EnhetensOppgaverParams,
  INameSearchParams,
  INameSearchResponse,
  IOppgaverResponse,
  ISaksbehandlere,
  UtgaatteApiResponse,
} from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { OppgaveListTagTypes, oppgaverApi } from '../oppgaver';

const oppgaverQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getMineFerdigstilteOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (queryParams) => `/kabal-search/oppgaver/ferdigstilte${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.MINE_FERDIGE],
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (queryParams) => `/kabal-search/oppgaver/uferdige${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.MINE_UFERDIGE],
    }),
    getMineVentendeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (queryParams) => `/kabal-search/oppgaver/paavent${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.MINE_VENTENDE],
    }),
    getLedigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (queryParams) => `/kabal-search/oppgaver/ledige${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.LEDIGE],
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.ENHETENS_FERDIGE],
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.ENHETENS_UFERDIGE],
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/paavent${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.ENHETENS_VENTENDE],
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, CommonOppgaverParams>({
      query: (queryParams) => `/kabal-search/antalloppgavermedutgaattefrister${queryStringify(queryParams)}`,
    }),
    searchPeopleByName: builder.query<INameSearchResponse, INameSearchParams>({
      query: (body) => ({ url: `/kabal-search/search/name`, method: 'POST', body }),
    }),
    searchOppgaverByFnr: builder.query<IOppgaverResponse, string>({
      query: (query) => ({
        url: `/kabal-search/search/oppgaver`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { query },
      }),
    }),
    searchPersonByFnr: builder.query<IPartBase, string>({
      query: (identifikator) => ({
        url: `/kabal-api/searchperson`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { identifikator },
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
  useGetEnhetensFerdigstilteOppgaverQuery,
  useGetMineFerdigstilteOppgaverQuery,
  useGetMineUferdigeOppgaverQuery,
  useGetMineVentendeOppgaverQuery,
  useGetLedigeOppgaverQuery,
  useGetAntallLedigeOppgaverMedUtgaatteFristerQuery,
  useSearchOppgaverByFnrQuery,
  useLazySearchPeopleByNameQuery,
  useGetSaksbehandlereInEnhetQuery,
  useSearchPersonByFnrQuery,
} = oppgaverQuerySlice;
