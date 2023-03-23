import { queryStringify } from '@app/functions/query-string';
import {
  ApiResponse,
  EnhetensFerdigstilteOppgaverParams,
  EnhetensUferdigeOppgaverParams,
  INameSearchParams,
  INameSearchResponse,
  IPersonAndOppgaverResponse,
  ISaksbehandlere,
  LedigeOppgaverParams,
  MineFerdigstilteOppgaverParams,
  MineUferdigeOppgaverParams,
  UtgaatteApiResponse,
  UtgaatteOppgaverParams,
} from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { OppgaveListTagTypes, UtgaatteFristerTagTypes, oppgaverApi } from '../oppgaver';
import { getMiniGetActions } from './get-mini-get-actions';

const oppgaveListTags = (type: OppgaveListTagTypes) => (result: ApiResponse | undefined) =>
  typeof result === 'undefined'
    ? [{ type, id: ListTagTypes.PARTIAL_LIST }]
    : result.behandlinger.map(({ id }) => ({ type, id })).concat({ type, id: ListTagTypes.PARTIAL_LIST });

const oppgaverQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getMineFerdigstilteOppgaver: builder.query<ApiResponse, MineFerdigstilteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/ansatte/${navIdent}/oppgaver/ferdigstilte${query}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        getMiniGetActions(data.behandlinger).forEach(dispatch);
      },
    }),
    getMineUferdigeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/ansatte/${navIdent}/oppgaver/uferdige${query}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        getMiniGetActions(data.behandlinger).forEach(dispatch);
      },
      providesTags: oppgaveListTags(OppgaveListTagTypes.TILDELTE_OPPGAVER),
    }),
    getMineVentendeOppgaver: builder.query<ApiResponse, MineUferdigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/ansatte/${navIdent}/oppgaver/paavent${query}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        getMiniGetActions(data.behandlinger).forEach(dispatch);
      },
      providesTags: oppgaveListTags(OppgaveListTagTypes.VENTENDE_OPPGAVER),
    }),
    getLedigeOppgaver: builder.query<ApiResponse, LedigeOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/ansatte/${navIdent}/oppgaver/ledige${query}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        getMiniGetActions(data.behandlinger).forEach(dispatch);
      },
      providesTags: oppgaveListTags(OppgaveListTagTypes.LEDIGE_OPPGAVER),
    }),
    getEnhetensFerdigstilteOppgaver: builder.query<ApiResponse, EnhetensFerdigstilteOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/ferdigstilte${query}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        getMiniGetActions(data.behandlinger).forEach(dispatch);
      },
    }),
    getEnhetensUferdigeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/uferdige${query}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        getMiniGetActions(data.behandlinger).forEach(dispatch);
      },
      providesTags: oppgaveListTags(OppgaveListTagTypes.ENHETENS_TILDELTE_OPPGAVER),
    }),
    getEnhetensVentendeOppgaver: builder.query<ApiResponse, EnhetensUferdigeOppgaverParams>({
      query: ({ enhetId, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/enhet/${enhetId}/oppgaver/tildelte/paavent${query}`;
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        getMiniGetActions(data.behandlinger).forEach(dispatch);
      },
    }),
    getAntallLedigeOppgaverMedUtgaatteFrister: builder.query<UtgaatteApiResponse, UtgaatteOppgaverParams>({
      query: ({ navIdent, ...queryParams }) => {
        const query = queryStringify(queryParams);

        return `/kabal-search/ansatte/${navIdent}/antalloppgavermedutgaattefrister${query}`;
      },
      providesTags: [UtgaatteFristerTagTypes.ANTALL_LEDIGE_MEDUTGAATTEFRISTER],
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
  useNameSearchQuery,
  useGetSaksbehandlereInEnhetQuery,
} = oppgaverQuerySlice;
