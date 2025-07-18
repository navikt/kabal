import type { SearchPersonResponse } from '@app/types/oppgave-common';
import type {
  ApiResponse,
  CommonOppgaverParams,
  EnhetensOppgaverParams,
  IMedunderskrivere,
  IOppgaverResponse,
  IRolList,
  ISaksbehandlere,
  RelevantOppgaverResponse,
  UtgaatteApiResponse,
} from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { OppgaveListTagTypes, oppgaverApi } from '../oppgaver';

const oppgaverQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getMineFerdigstilteOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-api/oppgaver/ferdigstilte', params }),
      providesTags: [OppgaveListTagTypes.MINE_FERDIGE],
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/oppgaver/uferdige', params }),
      providesTags: [OppgaveListTagTypes.MINE_UFERDIGE],
    }),
    getMineVentendeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/oppgaver/paavent', params }),
      providesTags: [OppgaveListTagTypes.MINE_VENTENDE],
    }),
    getLedigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/oppgaver/ledige', params }),
      providesTags: [OppgaveListTagTypes.LEDIGE],
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...params }) => ({
        url: `/kabal-api/enheter/${enhetId}/oppgaver/tildelte/ferdigstilte`,
        params,
      }),
      providesTags: [OppgaveListTagTypes.ENHETENS_FERDIGE],
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...params }) => ({ url: `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige`, params }),
      providesTags: [OppgaveListTagTypes.ENHETENS_UFERDIGE],
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensOppgaverParams>({
      query: ({ enhetId, ...params }) => ({ url: `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/paavent`, params }),
      providesTags: [OppgaveListTagTypes.ENHETENS_VENTENDE],
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/antalloppgavermedutgaattefrister', params }),
    }),
    searchOppgaverByFnr: builder.query<IOppgaverResponse, string>({
      query: (query) => ({
        url: '/kabal-search/search/oppgaver',
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { query },
      }),
    }),
    searchPersonByFnr: builder.query<SearchPersonResponse, string>({
      query: (identifikator) => ({
        url: '/kabal-api/searchperson',
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { identifikator },
      }),
    }),
    searchOppgaverBySaksnummer: builder.query<IOppgaverResponse, string>({
      query: (saksnummer) => ({ url: '/kabal-api/search/saksnummer', params: { saksnummer } }),
    }),
    getSaksbehandlereInEnhet: builder.query<ISaksbehandlere, string>({
      query: (enhet) => `/kabal-search/enheter/${enhet}/saksbehandlere`,
    }),
    getMedunderskrivereForEnhet: builder.query<IMedunderskrivere, string>({
      query: (enhet) => `/kabal-search/enheter/${enhet}/medunderskrivere`,
    }),
    getRolsInEnhet: builder.query<IRolList, void>({
      query: () => '/kabal-search/rol-list',
    }),
    getLedigeRolOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/roloppgaver/ledige', params }),
      providesTags: [OppgaveListTagTypes.ROL_LEDIGE],
    }),
    getUferdigeRolOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/roloppgaver/uferdige', params }),
      providesTags: [OppgaveListTagTypes.ROL_UFERDIGE],
    }),
    getReturnerteRolOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/roloppgaver/returnerte', params }),
      providesTags: [OppgaveListTagTypes.ROL_FERDIGE],
    }),
    getRolReturnerteOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/kroloppgaver/tildelte/returnerte', params }),
      providesTags: [OppgaveListTagTypes.KROLS_FERDIGE],
    }),
    getRolUferdigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/kroloppgaver/tildelte/uferdige', params }),
      providesTags: [OppgaveListTagTypes.KROLS_UFERDIGE],
    }),
    getRelevantOppgaver: builder.query<RelevantOppgaverResponse, string>({
      query: (oppgaveId) => `/kabal-api/behandlinger/${oppgaveId}/relevant`,
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
  useLazySearchOppgaverBySaksnummerQuery,
  useGetSaksbehandlereInEnhetQuery,
  useSearchPersonByFnrQuery,
  useLazySearchPersonByFnrQuery,
  useLazySearchOppgaverByFnrQuery,
  useGetReturnerteRolOppgaverQuery,
  useGetLedigeRolOppgaverQuery,
  useGetUferdigeRolOppgaverQuery,
  useGetMedunderskrivereForEnhetQuery,
  useGetRolReturnerteOppgaverQuery,
  useGetRolUferdigeOppgaverQuery,
  useGetRolsInEnhetQuery,
  useGetRelevantOppgaverQuery,
} = oppgaverQuerySlice;
