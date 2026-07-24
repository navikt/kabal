import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_API_BASE_QUERY } from '@/redux-api/common';
import type { ListGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

export interface GosysOppgaverParams {
  fnr: string;
  ytelseId: string;
  showClosed?: boolean;
}

export const gosysOppgaverApi = createApi({
  reducerPath: 'gosysOppgaverApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    gosysOppgaver: builder.query<ListGosysOppgave[], GosysOppgaverParams>({
      query: (body) => ({ url: '/gosysoppgaver', method: 'POST', body }),
    }),
  }),
});

export const { useGosysOppgaverQuery } = gosysOppgaverApi;
