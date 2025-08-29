import { toast } from '@app/components/toast/store';
import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { ABBREVIATIONS } from '@app/custom-data/abbreviations';
import type { CustomAbbrevation, ISetCustomInfoParams, ISettings, ISignatureResponse } from '@app/types/bruker';
import { isApiRejectionError } from '@app/types/errors';
import { createApi } from '@reduxjs/toolkit/query/react';
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
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke endre innstillinger';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
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
        } catch (error) {
          myPatchResult.undo();
          ansattPatchResult.undo();

          const heading = 'Kunne ikke endre signatur';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
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
        } catch (error) {
          myPatchResult.undo();

          const heading = 'Kunne ikke endre anonymitet';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
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
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke oppdatere forkortelse';
          const description = `Kunne ikke endre forkortelse «${params.short}» til «${params.long}».`;

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error, description);
          } else {
            apiErrorToast(heading, description);
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
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke slette forkortelse';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
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
        } catch (error) {
          const heading = 'Kunne ikke legge til forkortelse';
          const description = `Kunne ikke legge til forkortelse «${params.short}» → «${params.long}».`;

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error, description);
          } else {
            apiErrorToast(heading, description);
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
