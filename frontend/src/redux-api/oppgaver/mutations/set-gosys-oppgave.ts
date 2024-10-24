import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import type { BehandlingGosysOppgave } from '@app/types/oppgavebehandling/oppgavebehandling';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

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
      onQueryStarted: async ({ oppgaveId, gosysOppgaveId }, { dispatch, queryFulfilled }) => {
        const oppgavebehandlingPatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.gosysOppgaveId = gosysOppgaveId;
          }),
        );

        const gosysOppgaverResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getGosysOppgaveList', oppgaveId, (draft) => {
            for (const oppgave of draft) {
              if (oppgave.id === gosysOppgaveId) {
                oppgave.alreadyUsedBy = oppgaveId;
              } else if (oppgave.alreadyUsedBy === oppgaveId) {
                oppgave.alreadyUsedBy = null;
              }
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.gosysOppgaveId = gosysOppgaveId;
              draft.modified = data.modified;
              draft.gosysOppgaveId = data.gosysOppgave.id;
            }),
          );

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getGosysOppgaveList', oppgaveId, (draft) => {
              for (const oppgave of draft) {
                if (oppgave.id === gosysOppgaveId) {
                  oppgave.alreadyUsedBy = oppgaveId;
                } else if (oppgave.alreadyUsedBy === oppgaveId) {
                  oppgave.alreadyUsedBy = null;
                }
              }
            }),
          );
        } catch (e) {
          oppgavebehandlingPatchResult.undo();
          gosysOppgaverResult.undo();

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
