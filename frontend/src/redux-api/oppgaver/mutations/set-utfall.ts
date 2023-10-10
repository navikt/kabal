import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import {
  IOppgavebehandlingUtfallSetUpdateParams,
  IOppgavebehandlingUtfallUpdateParams,
} from '@app/types/oppgavebehandling/params';
import { ISetExtraUtfallResponse, ISetUtfallResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const setUtfallMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    updateUtfall: builder.mutation<ISetUtfallResponse, IOppgavebehandlingUtfallUpdateParams>({
      query: ({ oppgaveId, utfall }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/resultat/utfall`,
        method: 'PUT',
        body: { utfall },
      }),
      onQueryStarted: async ({ oppgaveId, utfall }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.resultat.utfallId = utfall;
            draft.resultat.extraUtfallIdSet = draft.resultat.extraUtfallIdSet.filter((id) => id !== utfall);
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
              draft.utfallId = utfall;
              draft.utfallId = data.utfallId;
            }),
          );
        } catch (e) {
          patchResult.undo();

          const message = 'Kunne ikke oppdatere utfall.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
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
        } catch (e) {
          patchResult.undo();

          const message = 'Kunne ikke oppdatere utfall.';

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

export const { useUpdateUtfallMutation, useUpdateExtraUtfallMutation } = setUtfallMutationSlice;
