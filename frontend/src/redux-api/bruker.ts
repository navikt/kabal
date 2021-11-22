import { createApi } from '@reduxjs/toolkit/query/react';
import { staggeredBaseQuery } from './common';

export interface IUser {
  navIdent: string;
  azureId: string;
  fornavn: string;
  etternavn: string;
  sammensattNavn: string;
  epost: string;
}

export interface IEnhet {
  id: string;
  navn: string;
  lovligeYtelser: string[];
}

export interface ISettings {
  hjemler: string[];
  ytelser: string[];
  typer: string[];
}

export interface IUserData {
  info: IUser;
  roller: string[];
  enheter: IEnhet[];
  valgtEnhetView: IEnhet;
  innstillinger: ISettings;
}

export interface ISetEnhet {
  enhetId: string;
  navIdent: string;
}

export interface IPostSettingsParams extends ISettings {
  navIdent: string;
}

export const brukerApi = createApi({
  reducerPath: 'brukerApi',
  baseQuery: staggeredBaseQuery,
  tagTypes: ['user'],
  endpoints: (builder) => ({
    getBruker: builder.query<IUserData, void>({
      query: () => '/api/kabal-innstillinger/me/brukerdata',
      providesTags: ['user'],
    }),
    getAnsatt: builder.query<IUserData, string>({
      query: (navIdent) => `/api/kabal-innstillinger/${navIdent}/brukerdata`,
    }),
    setValgtEnhet: builder.mutation<void, ISetEnhet>({
      query: ({ navIdent, enhetId }) => ({
        url: `/api/kabal-innstillinger/ansatte/${navIdent}/valgtenhet`,
        method: 'PUT',
        body: { enhetId },
      }),
      invalidatesTags: ['user'],
    }),
    updateSettings: builder.mutation<ISettings, IPostSettingsParams>({
      query: ({ navIdent, ...params }) => ({
        url: `/api/kabal-innstillinger/ansatte/${navIdent}/brukerdata/innstillinger`,
        method: 'PUT',
        body: { navIdent, ...params },
        validateStatus: ({ ok }) => ok,
        responseHandler: async (): Promise<ISettings> => params,
      }),
      invalidatesTags: ['user'],
      extraOptions: { maxRetries: 0 },
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        const settings: ISettings = {
          hjemler: params.hjemler,
          typer: params.typer,
          ytelser: params.ytelser,
        };
        const patchResult = dispatch(
          brukerApi.util.updateQueryData('getBruker', undefined, (draft) => {
            draft.innstillinger = settings;
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useGetBrukerQuery, useSetValgtEnhetMutation, useUpdateSettingsMutation } = brukerApi;
