import { createApi } from '@reduxjs/toolkit/query/react';
import { ISetCustomInfoParams, ISettings, ISignatureResponse } from '@app/types/bruker';
import { INNSTILLINGER_BASE_QUERY } from './common';

export const brukerApi = createApi({
  reducerPath: 'brukerApi',
  baseQuery: INNSTILLINGER_BASE_QUERY,
  endpoints: (builder) => ({
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
        url: '/me/innstillinger',
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
          }),
        );

        const ansattPatchResult = dispatch(
          brukerApi.util.updateQueryData('getSignature', navIdent, (draft) => {
            draft[key] = cleanedValue;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          myPatchResult.undo();
          ansattPatchResult.undo();
        }
      },
    }),
    setAnonymous: builder.mutation<{ value: boolean }, boolean>({
      query: (value) => ({
        method: 'PUT',
        url: '/me/anonymous',
        body: { value },
      }),
      onQueryStarted: async (value, { dispatch, queryFulfilled }) => {
        const myPatchResult = dispatch(
          brukerApi.util.updateQueryData('getMySignature', undefined, (draft) => {
            draft.anonymous = value;
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          myPatchResult.undo();
        }
      },
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
  useGetMySignatureQuery,
  useGetSettingsQuery,
  useGetSignatureQuery,
  useUpdateSettingsMutation,
  useSetCustomInfoMutation,
  useSetAnonymousMutation,
} = brukerApi;
