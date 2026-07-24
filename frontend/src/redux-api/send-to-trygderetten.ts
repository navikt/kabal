import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_API_BASE_QUERY } from '@/redux-api/common';

export interface OversendtAnkeITrygderettenFraArena {
  sakenGjelder: string;
  ytelseId: string;
  fagsakId: string;
  sakMottattKlageinstans: string;
  sendtTilTrygderetten: string;
  hjemmelIdList: string[];
  gosysOppgaveId: number;
}

export const sendToTrygderettenApi = createApi({
  reducerPath: 'sendToTrygderettenApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    sendToTrygderetten: builder.mutation<string, OversendtAnkeITrygderettenFraArena>({
      query: (body) => ({
        url: '/ankeritrygderetten-from-arena',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendToTrygderettenMutation } = sendToTrygderettenApi;
