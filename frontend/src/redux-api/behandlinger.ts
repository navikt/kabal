import { createApi } from '@reduxjs/toolkit/query/react';
import { IVedtakFullfoertResponse } from '../types/oppgavebehandling-response';
import { KABAL_BEHANDLINGER_BASE_QUERY } from './common';
import { oppgavebehandlingApi } from './oppgavebehandling';

export const behandlingerApi = createApi({
  reducerPath: 'behandlingerApi',
  baseQuery: KABAL_BEHANDLINGER_BASE_QUERY,
  endpoints: (builder) => ({
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
  }),
});

export const { useFinishOppgavebehandlingMutation } = behandlingerApi;
