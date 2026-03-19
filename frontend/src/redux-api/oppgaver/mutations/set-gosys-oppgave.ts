import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import type { BehandlingGosysOppgave } from '@/types/oppgavebehandling/oppgavebehandling';

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
