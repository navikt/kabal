import { ENVIRONMENT } from '@app/environment';
import type { IOppgave } from '@app/types/oppgaver';
import { oppgaverApi } from '../oppgaver';

export const oppgaveDataQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    getOppgave: builder.query<IOppgave, string>({
      query: (oppgaveId) => `/kabal-api/oppgaver/${oppgaveId}`,
    }),
  }),
});

export const { useGetOppgaveQuery } = oppgaveDataQuerySlice;
