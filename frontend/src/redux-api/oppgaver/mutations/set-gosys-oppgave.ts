import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { isApiRejectionError } from '@app/types/errors';
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
        try {
          await queryFulfilled;
        } catch (error) {
          const heading = 'Kunne ikke oppdatere Gosysoppgave';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
  }),
});

export const { useSetGosysOppgaveMutation } = setGosysOppgaveMutationSlice;
