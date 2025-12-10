import { ENVIRONMENT } from '@app/environment';
import type { IOppgave } from '@app/types/oppgaver';
import { OppgaveData, oppgaverApi } from '../oppgaver';

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
