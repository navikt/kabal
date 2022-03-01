import { createApi } from '@reduxjs/toolkit/query/react';
import { IApiValidationResponse } from '../functions/error-type-guard';
import { OppgaveType } from '../types/kodeverk';
import { IModifiedResponse, IVedtakFullfoertResponse } from '../types/oppgavebehandling-response';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { oppgavebehandlingApi } from './oppgavebehandling';

export const behandlingerApi = createApi({
  reducerPath: 'behandlingerApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  endpoints: (builder) => ({
    validate: builder.query<IApiValidationResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/validate`,
        validateStatus: ({ status, ok }) => ok || status === 400,
      }),
    }),
    finishOppgavebehandling: builder.mutation<IVedtakFullfoertResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/fullfoer`,
        method: 'POST',
      }),
      extraOptions: {
        maxRetries: 0,
      },
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.modified = data.modified;
            draft.isAvsluttetAvSaksbehandler = data.isAvsluttetAvSaksbehandler;
          })
        );
        oppgavebehandlingApi.util.invalidateTags(['oppgavebehandling']);
      },
    }),
    updateFinishedInGosys: builder.mutation<IModifiedResponse, string>({
      query: (oppgaveId) => ({
        url: `/${oppgaveId}/fullfoertgosys`,
        method: 'POST',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.type === OppgaveType.ANKE) {
              draft.fullfoertGosys = true;
            }
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            oppgavebehandlingApi.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useFinishOppgavebehandlingMutation,
  useValidateQuery,
  useLazyValidateQuery,
  useUpdateFinishedInGosysMutation,
} = behandlingerApi;
