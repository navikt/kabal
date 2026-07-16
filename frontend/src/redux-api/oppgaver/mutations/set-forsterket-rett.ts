import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import type { IForsterketRettParams } from '@/types/oppgavebehandling/params';
import type { IModifiedResponse } from '@/types/oppgavebehandling/response';

const setForsterketRettMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setForsterketRett: builder.mutation<IModifiedResponse, IForsterketRettParams>({
      query: ({ oppgaveId, forsterketRett }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/forsterketrett`,
        method: 'PUT',
        body: { forsterketRett },
      }),
      onQueryStarted: async ({ oppgaveId, forsterketRett }, { dispatch, queryFulfilled }) => {
        const oppgavePatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.forsterketRett = forsterketRett;
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
          oppgavePatchResult.undo();
        }
      },
    }),
  }),
});

export const { useSetForsterketRettMutation } = setForsterketRettMutationSlice;
