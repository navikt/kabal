import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { oppgaveDataQuerySlice } from '@/redux-api/oppgaver/queries/oppgave-data';
import type { ISetFlowStateParams } from '@/types/oppgavebehandling/params';
import type { ISetFlowStateResponse } from '@/types/oppgavebehandling/response';

const setMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
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
        } catch {
          oppgavePatchResult.undo();
        }
      },
    }),
  }),
});

export const { useSetMedunderskriverFlowStateMutation } = setMedunderskriverMutationSlice;
