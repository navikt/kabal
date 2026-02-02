import { ENVIRONMENT } from '@app/environment';
import type { BehandlingGosysOppgave } from '@app/types/oppgavebehandling/oppgavebehandling';
import { oppgaverApi } from '../oppgaver';

interface SetGosysOppgaveResponse {
  modified: string;
  gosysOppgave: BehandlingGosysOppgave;
}

interface SetGosysOppgaveParams {
  oppgaveId: string;
  gosysOppgaveId: number;
}

const setGosysOppgaveMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setGosysOppgave: builder.mutation<SetGosysOppgaveResponse, SetGosysOppgaveParams>({
      query: ({ oppgaveId, gosysOppgaveId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/gosysoppgaveid`,
        method: 'PUT',
        body: { gosysOppgaveId },
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        await queryFulfilled;
      },
    }),
  }),
});

export const { useSetGosysOppgaveMutation } = setGosysOppgaveMutationSlice;
