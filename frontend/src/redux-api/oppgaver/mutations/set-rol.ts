import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { oppgaveDataQuerySlice } from '@/redux-api/oppgaver/queries/oppgave-data';
import { FlowState } from '@/types/oppgave-common';
import type { ISetRolParams } from '@/types/oppgavebehandling/params';
import type { ISetRolResponse } from '@/types/oppgavebehandling/response';

const setRolMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setRol: builder.mutation<ISetRolResponse, ISetRolParams>({
      query: ({ oppgaveId, employee }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/rolnavident`,
        method: 'PUT',
        body: { navIdent: employee?.navIdent ?? null },
      }),
      onQueryStarted: async ({ oppgaveId, employee }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.rol.employee?.navIdent === employee?.navIdent) {
              return draft;
            }

            draft.rol.employee = employee;

            if (draft.rol.flowState === FlowState.RETURNED) {
              draft.rol.flowState = FlowState.NOT_SENT;
            }
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
              draft.rol.flowState = data.flowState;
              draft.rol.employee = data.employee;
            }),
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.rol.flowState = data.flowState;
              draft.rol.employee = data.employee;
              draft.rol.returnertDate = null;
            }),
          );
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useSetRolMutation } = setRolMutationSlice;
