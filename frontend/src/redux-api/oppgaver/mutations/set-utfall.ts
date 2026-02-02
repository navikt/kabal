import { ENVIRONMENT } from '@app/environment';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import type {
  IOppgavebehandlingUtfallSetUpdateParams,
  IOppgavebehandlingUtfallUpdateParams,
} from '@app/types/oppgavebehandling/params';
import type { ISetExtraUtfallResponse, ISetUtfallResponse } from '@app/types/oppgavebehandling/response';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setUtfallMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    updateUtfall: builder.mutation<ISetUtfallResponse, IOppgavebehandlingUtfallUpdateParams>({
      query: ({ oppgaveId, utfallId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/resultat/utfall`,
        method: 'PUT',
        body: { utfallId },
      }),
      onQueryStarted: async ({ oppgaveId, utfallId }, { dispatch, queryFulfilled }) => {
        const oppgavebehandlingPatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.resultat.utfallId = utfallId;

            if (utfallId === null) {
              draft.resultat.extraUtfallIdSet = [];
            }
          }),
        );

        const oppgavePatchResult = dispatch(
          oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
            draft.utfallId = utfallId;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
              draft.resultat.utfallId = data.utfallId;
              draft.resultat.extraUtfallIdSet = data.extraUtfallIdSet;
            }),
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.utfallId = data.utfallId;
            }),
          );
        } catch {
          oppgavebehandlingPatchResult.undo();
          oppgavePatchResult.undo();
        }
      },
    }),
    updateExtraUtfall: builder.mutation<ISetExtraUtfallResponse, IOppgavebehandlingUtfallSetUpdateParams>({
      query: ({ oppgaveId, extraUtfallIdSet }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/resultat/extra-utfall-set`,
        method: 'PUT',
        body: { extraUtfallIdSet },
      }),
      onQueryStarted: async ({ oppgaveId, extraUtfallIdSet }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.resultat.extraUtfallIdSet = extraUtfallIdSet;
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

export const { useUpdateUtfallMutation, useUpdateExtraUtfallMutation } = setUtfallMutationSlice;
