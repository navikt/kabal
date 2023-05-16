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
import { OppgaveListTagTypes, oppgaverApi } from '../oppgaver';

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
      providesTags: [OppgaveListTagTypes.MINE_FERDIGE],
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      transformResponse,
      query: (queryParams) => `/kabal-search/oppgaver/uferdige${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.MINE_UFERDIGE],
    }),
    getMineVentendeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      transformResponse,
      query: (queryParams) => `/kabal-search/oppgaver/paavent${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.MINE_VENTENDE],
    }),
    getLedigeOppgaver: builder.query<ApiResponse, LedigeOppgaverParams>({
      transformResponse,
      query: (queryParams) => `/kabal-search/oppgaver/ledige${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.LEDIGE],
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensFerdigstilteOppgaverParams>({
      transformResponse,
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.ENHETENS_FERDIGE],
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      transformResponse,
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.ENHETENS_UFERDIGE],
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      transformResponse,
      query: ({ enhetId, ...queryParams }) =>
        `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/paavent${queryStringify(queryParams)}`,
      providesTags: [OppgaveListTagTypes.ENHETENS_VENTENDE],
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
        aapneBehandlinger: isStringArray(aapneBehandlinger) ? aapneBehandlinger : aapneBehandlinger.map(({ id }) => id),
        avsluttedeBehandlinger: isStringArray(avsluttedeBehandlinger)
          ? avsluttedeBehandlinger
          : avsluttedeBehandlinger.map(({ id }) => id),
        fnr,
        navn,
      }),
    }),
    getSaksbehandlereInEnhet: builder.query<ISaksbehandlere, string>({
      query: (enhet) => `/kabal-search/enheter/${enhet}/saksbehandlere`,
    }),
  }),
});

const isStringArray = (array: unknown[]): array is string[] => array.some((item) => typeof item === 'string');

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
