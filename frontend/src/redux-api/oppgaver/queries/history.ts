import { ENVIRONMENT } from '@app/environment';
import { oppgaverApi } from '@app/redux-api/oppgaver/oppgaver';
import type { IHistoryResponse } from '@app/types/oppgavebehandling/response';

export const historyQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    getHistory: builder.query<IHistoryResponse, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/history`,
    }),
  }),
});

export const { useGetHistoryQuery } = historyQuerySlice;
