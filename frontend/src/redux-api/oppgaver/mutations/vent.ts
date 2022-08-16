import { IModifiedResponse } from '../../../types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const ventMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    sattPaaVent: builder.mutation<IModifiedResponse, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/klagebehandlinger/${oppgaveId}/sattpaavent`,
        method: 'POST',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.sattPaaVent = new Date().toISOString();
          })
        );

        try {
          await queryFulfilled;
          dispatch(oppgaverApi.util.invalidateTags(['ventende-oppgaver', 'tildelte-oppgaver']));
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteSattPaaVent: builder.mutation<IModifiedResponse, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/klagebehandlinger/${oppgaveId}/sattpaavent`,
        method: 'DELETE',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.sattPaaVent = null;
          })
        );

        try {
          await queryFulfilled;
          dispatch(oppgaverApi.util.invalidateTags(['ventende-oppgaver', 'tildelte-oppgaver']));
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useSattPaaVentMutation, useDeleteSattPaaVentMutation } = ventMutationSlice;
