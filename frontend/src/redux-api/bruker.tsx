import { createApi } from '@reduxjs/toolkit/query/react';
import React from 'react';
import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import { CustomAbbrevation, ISetCustomInfoParams, ISettings, ISignatureResponse } from '@app/types/bruker';
import { isApiRejectionError } from '@app/types/errors';
import { INNSTILLINGER_BASE_QUERY } from './common';

export const brukerApi = createApi({
  reducerPath: 'brukerApi',
  baseQuery: INNSTILLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    getMySignature: builder.query<ISignatureResponse, void>({ query: () => '/me/signature' }),
    getSignature: builder.query<ISignatureResponse, string>({ query: (navIdent) => `/ansatte/${navIdent}/signature` }),
    getSettings: builder.query<ISettings, void>({ query: () => '/me/innstillinger' }),
    updateSettings: builder.mutation<ISettings, ISettings>({
      query: (body) => ({ url: '/me/innstillinger', method: 'PUT', body }),
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
      query: ({ key, value }) => ({ method: 'PUT', url: `/me/${key}`, body: { value: cleanValue(value) } }),
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
      query: (value) => ({ method: 'PUT', url: '/me/anonymous', body: { value } }),
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
    getAbbreviations: builder.query<CustomAbbrevation[], void>({ query: () => '/me/abbreviations' }),
    updateAbbreviation: builder.mutation<CustomAbbrevation, CustomAbbrevation>({
      query: ({ id, ...body }) => ({ url: `/me/abbreviations/${id}`, method: 'PUT', body }),
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          brukerApi.util.updateQueryData('getAbbreviations', undefined, (draft) =>
            draft.map((item) => (item.id === params.id ? params : item)),
          ),
        );

        try {
          await queryFulfilled;

          toast.success(
            <span>
              Forkortelse <b>{params.short}</b> endret til: <i>{params.long}</i>
            </span>,
          );

          ABBREVIATIONS.updateAbbreviation(params);
        } catch (e) {
          patchResult.undo();

          if (isApiRejectionError(e)) {
            apiErrorToast('Kunne ikke oppdatere forkortelse.', e.error);
          } else {
            toast.error('Kunne ikke oppdatere forkortelse.');
          }
        }
      },
    }),
    deleteAbbreviation: builder.mutation<void, string>({
      query: (id) => ({ url: `/me/abbreviations/${id}`, method: 'DELETE' }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          brukerApi.util.updateQueryData('getAbbreviations', undefined, (draft) =>
            draft.filter((item) => item.id !== id),
          ),
        );

        try {
          await queryFulfilled;
          toast.success('Forkortelse slettet');
          ABBREVIATIONS.removeAbbreviation(id);
        } catch {
          patchResult.undo();
        }
      },
    }),
    addAbbreviation: builder.mutation<CustomAbbrevation, Omit<CustomAbbrevation, 'id'>>({
      query: (body) => ({ url: '/me/abbreviations', method: 'POST', body }),
      onQueryStarted: async (params, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          toast.success(
            <span>
              Forkortelse <b>{params.short}</b>: <i>{params.long}</i> lagt til
            </span>,
          );

          dispatch(
            brukerApi.util.updateQueryData('getAbbreviations', undefined, (draft) => {
              if (draft !== undefined) {
                draft.push(data);

                return;
              }

              return [data];
            }),
          );

          ABBREVIATIONS.addAbbreviation(data);
        } catch (e) {
          if (isApiRejectionError(e)) {
            apiErrorToast('Kunne ikke legge til forkortelse.', e.error);
          } else {
            toast.error('Kunne ikke legge til forkortelse.');
          }
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
  useGetAbbreviationsQuery,
  useUpdateAbbreviationMutation,
  useDeleteAbbreviationMutation,
  useAddAbbreviationMutation,
} = brukerApi;
