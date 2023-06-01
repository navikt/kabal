import { getFullName } from '@app/domain/name';
import { queryStringify } from '@app/functions/query-string';
import { LegacyNameSearchResponse } from '@app/types/legacy';
import { IPartBase } from '@app/types/oppgave-common';
import {
  ApiResponse,
  EnhetensFerdigstilteOppgaverParams,
  EnhetensUferdigeOppgaverParams,
  INameSearchParams,
  INameSearchResponse,
  IOppgaverResponse,
  ISaksbehandlere,
  LedigeOppgaverParams,
  MineFerdigstilteOppgaverParams,
  MineUferdigeOppgaverParams,
  UtgaatteApiResponse,
  UtgaatteOppgaverParams,
} from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { OppgaveListTagTypes, oppgaverApi } from '../oppgaver';

interface IdObject {
  id: string;
}

interface OldApiResponse {
  behandlinger: IdObject[];
  antallTreffTotalt: number;
}

interface OldSearchResponse {
  aapneBehandlinger: IdObject[];
  avsluttedeBehandlinger: IdObject[];
}

const transformResponse = ({ behandlinger, ...rest }: OldApiResponse | ApiResponse) => {
  if (isStringArray(behandlinger)) {
    return { behandlinger, ...rest };
  }

  return {
    behandlinger: behandlinger.map(({ id }) => id),
    ...rest,
  };
};

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
    searchPeopleByName: builder.query<INameSearchResponse, INameSearchParams>({
      query: (body) => ({ url: `/kabal-search/search/name`, method: 'POST', body }),
      transformResponse: (res: LegacyNameSearchResponse | INameSearchResponse): INameSearchResponse => ({
        people: res.people.map((person) => ({
          id: 'id' in person ? person.id : person.fnr,
          name: 'name' in person ? person.name : getFullName(person.navn),
        })),
      }),
    }),
    searchOppgaverByFnr: builder.query<IOppgaverResponse, string>({
      query: (query) => ({
        url: `/kabal-search/search/oppgaver`,
        method: 'POST', // Søk POST for å ikke sende fnr inn i URLen, som blir logget.
        body: { query },
      }),
      transformResponse: ({
        aapneBehandlinger: aapne,
        avsluttedeBehandlinger: avsluttede,
      }: OldSearchResponse | IOppgaverResponse): IOppgaverResponse => ({
        aapneBehandlinger: isStringArray(aapne) ? aapne : aapne.map(({ id }) => id),
        avsluttedeBehandlinger: isStringArray(avsluttede) ? avsluttede : avsluttede.map(({ id }) => id),
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

const isStringArray = (array: unknown[]): array is string[] => array.some((item) => typeof item === 'string');

export const {
  useGetEnhetensUferdigeOppgaverQuery,
  useGetEnhetensVentendeOppgaverQuery,
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
