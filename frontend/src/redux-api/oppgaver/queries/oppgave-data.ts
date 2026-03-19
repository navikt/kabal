import { ENVIRONMENT } from '@/environment';
import { OppgaveData, oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import type { IOppgave } from '@/types/oppgaver';

export const oppgaveDataQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    getOppgave: builder.query<IOppgave, string>({
      query: (oppgaveId) => `/kabal-api/oppgaver/${oppgaveId}`,
      providesTags: (result) => (result === undefined ? [] : [{ type: OppgaveData.OPPGAVE_DATA, id: result.id }]),
    }),
  }),
});

export const { useGetOppgaveQuery } = oppgaveDataQuerySlice;
