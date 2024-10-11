import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import type { IOppgavebehandlingHjemlerUpdateParams } from '@app/types/oppgavebehandling/params';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setRegistreringshjemlerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    updateRegistreringshjemler: builder.mutation<{ modified: string }, IOppgavebehandlingHjemlerUpdateParams>({
      query: ({ oppgaveId, hjemmelIdSet }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/resultat/hjemler`,
        method: 'PUT',
        body: { hjemmelIdSet },
      }),
      onQueryStarted: async ({ oppgaveId, hjemmelIdSet }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.resultat.hjemmelIdSet = hjemmelIdSet;
          }),
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
            }),
          );
        } catch (e) {
          patchResult.undo();

          const message = 'Kunne ikke oppdatere hjemler.';

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

export const { useUpdateRegistreringshjemlerMutation } = setRegistreringshjemlerMutationSlice;
