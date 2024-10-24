import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import type { BehandlingGosysOppgave } from '@app/types/oppgavebehandling/oppgavebehandling';
import { IS_LOCALHOST } from '../../common';
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
  overrideExisting: IS_LOCALHOST,
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
        } catch (e) {
          const message = 'Kunne ikke oppdatere Gosysoppgave.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
  }),
});

export const { useSetGosysOppgaveMutation } = setGosysOppgaveMutationSlice;
