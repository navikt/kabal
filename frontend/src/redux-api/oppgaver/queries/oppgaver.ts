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
      query: (params) => ({ url: `/kabal-search/oppgaver/ferdigstilte`, params }),
      providesTags: [OppgaveListTagTypes.MINE_FERDIGE],
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: `/kabal-search/oppgaver/uferdige`, params }),
      providesTags: [OppgaveListTagTypes.MINE_UFERDIGE],
    }),
    getMineVentendeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: `/kabal-search/oppgaver/paavent`, params }),
      providesTags: [OppgaveListTagTypes.MINE_VENTENDE],
    }),
    getLedigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: `/kabal-search/oppgaver/ledige`, params }),
      providesTags: [OppgaveListTagTypes.LEDIGE],
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...params }) => ({
        url: `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte`,
        params,
      }),
      providesTags: [OppgaveListTagTypes.ENHETENS_FERDIGE],
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...params }) => ({
        url: `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige`,
        params,
      }),
      providesTags: [OppgaveListTagTypes.ENHETENS_UFERDIGE],
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...params }) => ({
        url: `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/paavent`,
        params,
      }),
      providesTags: [OppgaveListTagTypes.ENHETENS_VENTENDE],
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: `/kabal-search/antalloppgavermedutgaattefrister`, params }),
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
    getLedigeRolOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: `/kabal-search/roloppgaver/ledige`, params }),
      providesTags: [OppgaveListTagTypes.ROL_LEDIGE],
    }),
    getUferdigeRolOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: `/kabal-search/roloppgaver/uferdige`, params }),
      providesTags: [OppgaveListTagTypes.ROL_UFERDIGE],
    }),
    getFerdigeRolOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: `/kabal-search/roloppgaver/ferdigstilte`, params }),
      providesTags: [OppgaveListTagTypes.ROL_FERDIGE],
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
  useGetFerdigeRolOppgaverQuery,
  useGetLedigeRolOppgaverQuery,
  useGetUferdigeRolOppgaverQuery,
} = oppgaverQuerySlice;
