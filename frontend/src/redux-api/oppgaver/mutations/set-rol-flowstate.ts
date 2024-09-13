import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import type { ISetFlowStateParams } from '@app/types/oppgavebehandling/params';
import type { ISetFlowStateResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setRolStateMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setRolState: builder.mutation<ISetFlowStateResponse, ISetFlowStateParams>({
      query: ({ oppgaveId, flowState }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/rolflowstate`,
        method: 'PUT',
        body: { flowState },
      }),
      onQueryStarted: async ({ oppgaveId, flowState }, { dispatch, queryFulfilled }) => {
        const oppgavePatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
              return draft;
            }

            draft.rol.flowState = flowState;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (draft.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
                return draft;
              }

              draft.modified = data.modified;
              draft.rol.flowState = data.flowState;
              draft.rol.employee = data.employee;
            }),
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              if (draft.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
                return draft;
              }

              draft.rol.flowState = data.flowState;
              draft.rol.employee = data.employee;
              draft.rol.returnertDate = null;
            }),
          );
        } catch (e) {
          oppgavePatchResult.undo();

          const message = ERRORS[flowState];

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

const ERRORS: Record<FlowState, string> = {
  [FlowState.SENT]: 'Kunne ikke sende til rådgivende overlege.',
  [FlowState.RETURNED]: 'Kunne ikke returnere til saksbehandler.',
  [FlowState.NOT_SENT]: 'Kunne ikke sette tilbake til ikke sendt.',
};

export const { useSetRolStateMutation } = setRolStateMutationSlice;
