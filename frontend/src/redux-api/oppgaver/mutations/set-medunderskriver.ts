import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { FlowState } from '@app/types/oppgave-common';
import { ISetMedunderskriverParams } from '@app/types/oppgavebehandling/params';
import { ISetMedunderskriverResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const setMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setMedunderskriver: builder.mutation<ISetMedunderskriverResponse, ISetMedunderskriverParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/medunderskrivernavident`,
        method: 'PUT',
        body: {
          navIdent,
        },
      }),
      onQueryStarted: async ({ oppgaveId, navIdent }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.medunderskriver.navIdent === navIdent) {
              return;
            }

            if (draft.medunderskriver.flowState === FlowState.RETURNED) {
              draft.medunderskriver = {
                navIdent,
                flowState: FlowState.NOT_SENT,
                returnertdDate: null,
              };
            } else {
              draft.medunderskriver.navIdent = navIdent;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;
          const { modified, ...medunderskriver } = data;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = modified;
              draft.medunderskriver = medunderskriver;
            }),
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.medunderskriver = medunderskriver;
            }),
          );

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getMedunderskriver', oppgaveId, (draft) => {
              draft.navIdent = medunderskriver.navIdent;
              draft.flowState = medunderskriver.flowState;
              draft.modified = modified;
            }),
          );
        } catch (e) {
          patchResult.undo();

          const message = 'Kunne ikke oppdatere medunderskriver.';

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

export const { useSetMedunderskriverMutation } = setMedunderskriverMutationSlice;
