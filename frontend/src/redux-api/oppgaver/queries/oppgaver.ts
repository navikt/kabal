import { queryStringify } from '../../../functions/query-string';
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
} from '../../../types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

export const oppgaverQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getMineFerdigstilteOppgaver: builder.query<ApiResponse, MineFerdigstilteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/ansatte/${navIdent}/oppgaver/ferdigstilte${query}`;
      },
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/ansatte/${navIdent}/oppgaver/uferdige${query}`;
      },
      providesTags: ['tildelte-oppgaver'],
    }),
    getMineVentendeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/ansatte/${navIdent}/oppgaver/paavent${query}`;
      },
      providesTags: ['ventende-oppgaver'],
    }),
    getMineLedigeOppgaver: builder.query<ApiResponse, MineLedigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/ansatte/${navIdent}/oppgaver/ledige${query}`;
      },
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensFerdigstilteOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte${query}`;
      },
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige${query}`;
      },
      providesTags: ['enhetens-tildelte-oppgaver'],
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/paavent${query}`;
      },
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, UtgaatteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);
        return `/kabal-search/ansatte/${navIdent}/antalloppgavermedutgaattefrister${query}`;
      },
      providesTags: ['ledige-medutgaattefrister'],
    }),
    nameSearch: builder.query<INameSearchResponse, INameSearchParams>({
      query: (body) => ({
        url: `/kabal-search/search/name`,
        method: 'POST',
        body,
      }),
    }),
    personAndOppgaver: builder.query<IPersonAndOppgaverResponse, string>({
      query: (query) => ({
        url: `/kabal-search/search/personogoppgaver`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { query },
      }),
      transformResponse: ({
        aapneBehandlinger,
        avsluttedeBehandlinger,
        behandlinger,
        fnr,
        navn,
      }: IPersonAndOppgaverResponse) => ({
        aapneBehandlinger,
        avsluttedeBehandlinger,
        behandlinger,
        fnr,
        navn,
      }),
    }),
    getSaksbehandlereInEnhet: builder.query<IGetSaksbehandlereInEnhetResponse, string>({
      query: (enhet) => `/kabal-search/enheter/${enhet}/saksbehandlere`,
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
} = oppgaverQuerySlice;
