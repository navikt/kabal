import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { FlowState } from '@app/types/oppgave-common';
import { ISetFlowStateParams } from '@app/types/oppgavebehandling/params';
import { ISetFlowStateResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

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
            draft.rol.flowState = flowState;
          }),
        );

        try {
          const { data } = await queryFulfilled;
          const { modified, ...rol } = data;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = modified;
              draft.rol = rol;
            }),
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.rol.flowState = data.flowState;
              draft.rol.navIdent = data.navIdent;
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
