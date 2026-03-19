import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import type { IHistoryResponse } from '@/types/oppgavebehandling/response';

export const historyQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    getHistory: builder.query<IHistoryResponse, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/history`,
    }),
  }),
});

export const { useGetHistoryQuery } = historyQuerySlice;
