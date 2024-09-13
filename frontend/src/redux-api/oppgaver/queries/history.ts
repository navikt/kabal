import type { IHistoryResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

export const historyQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getHistory: builder.query<IHistoryResponse, string>({
      query: (id) => `/kabal-api/behandlinger/${id}/history`,
    }),
  }),
});

export const { useGetHistoryQuery } = historyQuerySlice;
