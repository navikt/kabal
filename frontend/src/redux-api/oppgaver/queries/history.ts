import { ENVIRONMENT } from '@app/environment';
import type { IHistoryResponse } from '@app/types/oppgavebehandling/response';
import { oppgaverApi } from '../oppgaver';

export const historyQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    getHistory: builder.query<IHistoryResponse, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/history`,
    }),
  }),
});

export const { useGetHistoryQuery } = historyQuerySlice;
