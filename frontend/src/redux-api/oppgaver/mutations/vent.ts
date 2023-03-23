import { IModifiedResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { OppgaveListTagTypes, oppgaverApi } from '../oppgaver';
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
          dispatch(
            oppgaverApi.util.invalidateTags([
              { type: OppgaveListTagTypes.VENTENDE_OPPGAVER, id: oppgaveId },
              { type: OppgaveListTagTypes.VENTENDE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
              { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: oppgaveId },
              { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
            ])
          );
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
          dispatch(
            oppgaverApi.util.invalidateTags([
              { type: OppgaveListTagTypes.VENTENDE_OPPGAVER, id: oppgaveId },
              { type: OppgaveListTagTypes.VENTENDE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
              { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: oppgaveId },
              { type: OppgaveListTagTypes.TILDELTE_OPPGAVER, id: ListTagTypes.PARTIAL_LIST },
            ])
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useSattPaaVentMutation, useDeleteSattPaaVentMutation } = ventMutationSlice;
