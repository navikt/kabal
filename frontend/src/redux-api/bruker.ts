import { createApi } from '@reduxjs/toolkit/query/react';
import { OppgaveType } from '../types/kodeverk';
import { IMedunderskrivereParams } from '../types/oppgavebehandling-params';
import { IMedunderskrivereResponse } from '../types/oppgavebehandling-response';
import { INNSTILLINGER_BASE_QUERY } from './common';

export interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export interface ISettings {
  hjemler: string[];
  ytelser: string[];
  typer: OppgaveType[];
}

export interface IUserData {
  navIdent: string;
  roller: Role[];
  enheter: IEnhet[];
  ansattEnhet: IEnhet;
}

interface ICustomUserInfo {
  customLongName: string | null;
  customShortName: string | null;
  customJobTitle: string | null;
}

export interface ISignatureResponse extends ICustomUserInfo {
  longName: string;
  generatedShortName: string;
}

export enum Role {
  ROLE_KLAGE_SAKSBEHANDLER = 'ROLE_KLAGE_SAKSBEHANDLER',
  ROLE_KLAGE_FAGANSVARLIG = 'ROLE_KLAGE_FAGANSVARLIG',
  ROLE_KLAGE_LEDER = 'ROLE_KLAGE_LEDER',
  ROLE_KLAGE_MERKANTIL = 'ROLE_KLAGE_MERKANTIL',
  ROLE_KLAGE_FORTROLIG = 'ROLE_KLAGE_FORTROLIG',
  ROLE_KLAGE_STRENGT_FORTROLIG = 'ROLE_KLAGE_STRENGT_FORTROLIG',
  ROLE_KLAGE_EGEN_ANSATT = 'ROLE_KLAGE_EGEN_ANSATT',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export interface ISetEnhet {
  enhetId: string;
  navIdent: string;
}

export interface IPostSettingsParams extends ISettings {
  navIdent: string;
}

export interface ISetInfoParams {
  value: string;
}

export interface ISetCustomInfoParams {
  key: keyof ICustomUserInfo;
  value: string | null;
  navIdent: string;
}

export const brukerApi = createApi({
  reducerPath: 'brukerApi',
  baseQuery: INNSTILLINGER_BASE_QUERY,
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getBruker: builder.query<IUserData, void>({
      query: () => '/me/brukerdata',
      providesTags: ['user'],
    }),
    getMySignature: builder.query<ISignatureResponse, void>({
      query: () => '/me/signature',
    }),
    getSignature: builder.query<ISignatureResponse, string>({
      query: (navIdent) => `/ansatte/${navIdent}/signature`,
    }),
    getSettings: builder.query<ISettings, void>({
      query: () => '/me/innstillinger',
    }),
    updateSettings: builder.mutation<ISettings, ISettings>({
      query: (body) => ({
        url: `/me/innstillinger`,
        method: 'PUT',
        body,
      }),
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(brukerApi.util.updateQueryData('getSettings', undefined, () => params));

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    setCustomInfo: builder.mutation<{ value: string }, ISetCustomInfoParams>({
      query: ({ key, value }) => ({
        method: 'PUT',
        url: `/me/${key}`,
        body: { value: cleanValue(value) },
      }),
      onQueryStarted: async ({ key, value, navIdent }, { dispatch, queryFulfilled }) => {
        const cleanedValue = cleanValue(value);

        const myPatchResult = dispatch(
          brukerApi.util.updateQueryData('getMySignature', undefined, (draft) => {
            draft[key] = cleanedValue;
          })
        );

        const ansattPatchResult = dispatch(
          brukerApi.util.updateQueryData('getSignature', navIdent, (draft) => {
            draft[key] = cleanedValue;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          myPatchResult.undo();
          ansattPatchResult.undo();
        }
      },
    }),
    searchMedunderskrivere: builder.query<IMedunderskrivereResponse, IMedunderskrivereParams>({
      query: (body) => ({
        method: 'POST',
        url: '/search/medunderskrivere',
        body,
      }),
    }),
  }),
});

const cleanValue = (value: string | null) => {
  if (value === null) {
    return null;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  return trimmed.replaceAll(/\s+/g, ' ');
};

export const {
  useGetBrukerQuery,
  useGetMySignatureQuery,
  useGetSettingsQuery,
  useGetSignatureQuery,
  useSearchMedunderskrivereQuery,
  useUpdateSettingsMutation,
  useSetCustomInfoMutation,
} = brukerApi;
