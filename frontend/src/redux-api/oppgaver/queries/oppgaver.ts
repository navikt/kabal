import { ENVIRONMENT } from '@/environment';
import { OppgaveListTagTypes, oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import type { SearchPersonResponse } from '@/types/oppgave-common';
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
} from '@/types/oppgaver';

const oppgaverQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
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
    getLedigeAnkerAfter2027: builder.query<ApiResponse, CommonOppgaverParams>({
      // TODO: Correct URL
      query: (params) => ({ url: '/kabal-search/oppgaver/ledige-anker-after-2027', params }),
      providesTags: [OppgaveListTagTypes.LEDIGE_ANKER_AFTER_2027],
    }),
    getAntallLedigeAnkerAfter2027MedUtgaatteFrister: builder.query<UtgaatteApiResponse, CommonOppgaverParams>({
      // TODO: Correct URL
      query: (params) => ({ url: '/kabal-search/antallledigeankerafter2027medutgaattefrister', params }),
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
    getTildelteOppgaverITR: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/oppgaver-i-tr/tildelte', params }),
      providesTags: [OppgaveListTagTypes.TR_TILDELTE],
    }),
    getLedigeOppgaverITR: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/oppgaver-i-tr/ledige', params }),
      providesTags: [OppgaveListTagTypes.TR_LEDIGE],
    }),
    getVentendeOppgaverITR: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/oppgaver-i-tr/paa-vent', params }),
      providesTags: [OppgaveListTagTypes.TR_VENTENDE],
    }),
    getFerdigstilteAnkerITR: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/oppgaver-i-tr/ferdigstilt', params }),
      providesTags: [OppgaveListTagTypes.TR_FERDIGE],
    }),
    getAnketeamLedigeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/anketeam/ledige', params }),
      providesTags: [OppgaveListTagTypes.ANKETEAM_LEDIGE],
    }),
    getAnketeamTildelteOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/anketeam/tildelte', params }),
      providesTags: [OppgaveListTagTypes.ANKETEAM_TILDELTE],
    }),
    getAnketeamVentendeOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/anketeam/paa-vent', params }),
      providesTags: [OppgaveListTagTypes.ANKETEAM_VENTENDE],
    }),
    getAnketeamFerdigstilteOppgaver: builder.query<ApiResponse, CommonOppgaverParams>({
      query: (params) => ({ url: '/kabal-search/anketeam/ferdigstilte', params }),
      providesTags: [OppgaveListTagTypes.ANKETEAM_FERDIGSTILTE],
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
  useGetTildelteOppgaverITRQuery,
  useGetLedigeOppgaverITRQuery,
  useGetVentendeOppgaverITRQuery,
  useGetLedigeAnkerAfter2027Query,
  useGetAntallLedigeAnkerAfter2027MedUtgaatteFristerQuery,
  useGetAnketeamLedigeOppgaverQuery,
  useGetAnketeamTildelteOppgaverQuery,
  useGetAnketeamVentendeOppgaverQuery,
  useGetAnketeamFerdigstilteOppgaverQuery,
  useGetFerdigstilteAnkerITRQuery,
} = oppgaverQuerySlice;
