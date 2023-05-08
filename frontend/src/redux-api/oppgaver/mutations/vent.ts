import { getVenteperiode } from '@app/functions/get-venteperiode';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { IModifiedResponse } from '@app/types/oppgavebehandling/response';
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
        const behandlingPatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.sattPaaVent = new Date().toISOString();
          })
        );

        const oppgavePathResult = dispatch(
          oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
            draft.sattPaaVent = getVenteperiode();
          })
        );

        try {
          await queryFulfilled;
        } catch {
          behandlingPatchResult.undo();
          oppgavePathResult.undo();
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
          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.sattPaaVent = null;
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useSattPaaVentMutation, useDeleteSattPaaVentMutation } = ventMutationSlice;
