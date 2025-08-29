import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { FlowState } from '@app/types/oppgave-common';
import type { ISetFlowStateParams } from '@app/types/oppgavebehandling/params';
import type { ISetFlowStateResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setMedunderskriverFlowState: builder.mutation<ISetFlowStateResponse, ISetFlowStateParams>({
      query: ({ oppgaveId, flowState }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/medunderskriverflowstate`,
        method: 'PUT',
        body: { flowState },
      }),
      onQueryStarted: async ({ oppgaveId, flowState }, { dispatch, queryFulfilled }) => {
        const oppgavePatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.medunderskriver.flowState = flowState;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
              draft.medunderskriver.flowState = data.flowState;
              draft.medunderskriver.employee = data.employee;
            }),
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.medunderskriver.flowState = data.flowState;
              draft.medunderskriver.employee = data.employee;
              draft.medunderskriver.returnertDate = null;
            }),
          );
        } catch (error) {
          oppgavePatchResult.undo();

          const heading = ERRORS[flowState];

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

const ERRORS: Record<FlowState, string> = {
  [FlowState.SENT]: 'Kunne ikke sende til medunderskriver',
  [FlowState.RETURNED]: 'Kunne ikke returnere til saksbehandler',
  [FlowState.NOT_SENT]: 'Kunne ikke sette tilbake til ikke sendt',
};

export const { useSetMedunderskriverFlowStateMutation } = setMedunderskriverMutationSlice;
