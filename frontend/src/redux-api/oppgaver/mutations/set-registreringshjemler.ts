import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import { isApiRejectionError } from '@app/types/errors';
import type { IOppgavebehandlingHjemlerUpdateParams } from '@app/types/oppgavebehandling/params';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setRegistreringshjemlerMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
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
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke oppdatere hjemler';

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

export const { useUpdateRegistreringshjemlerMutation } = setRegistreringshjemlerMutationSlice;
