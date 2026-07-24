import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_API_BASE_QUERY } from '@/redux-api/common';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

export interface GosysOppgaverParams {
  fnr: string;
  ytelseId: string;
}
export interface GosysOppgaveRequest {
  sakenGjelder: string;
  ytelseId: string;
  fagsakId: string;
  sakMottattKlageinstans: string;
  sendtTilTrygderetten: string;
  hjemmelIdList: string[];
  gosysOppgaveId: number;
}

export const gosysOppgaverApi = createApi({
  reducerPath: 'gosysOppgaverApi',
  baseQuery: KABAL_API_BASE_QUERY,
  tagTypes: ['GosysOppgaver'],
  endpoints: (builder) => ({
    gosysOppgaver: builder.query<ListGosysOppgave[], GosysOppgaverParams>({
      query: (body) => ({ url: '/gosysoppgaver', method: 'POST', body }),
      providesTags: ['GosysOppgaver'],
    }),
    sendToTrygderetten: builder.mutation<string, GosysOppgaveRequest>({
      query: (body) => ({
        url: '/api/ankeritrygderetten-fra-arena',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['GosysOppgaver'],
    }),
  }),
});

export const { useGosysOppgaverQuery, useSendToTrygderettenMutation } = gosysOppgaverApi;
