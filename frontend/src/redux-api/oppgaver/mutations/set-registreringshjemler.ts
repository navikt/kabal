import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import type { IOppgavebehandlingHjemlerUpdateParams } from '@/types/oppgavebehandling/params';

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
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useUpdateRegistreringshjemlerMutation } = setRegistreringshjemlerMutationSlice;
