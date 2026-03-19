import { ENVIRONMENT } from '@/environment';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { oppgaveDataQuerySlice } from '@/redux-api/oppgaver/queries/oppgave-data';
import { FlowState } from '@/types/oppgave-common';
import type { ISetMedunderskriverParams } from '@/types/oppgavebehandling/params';
import type { ISetMedunderskriverResponse } from '@/types/oppgavebehandling/response';

const setMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setMedunderskriver: builder.mutation<ISetMedunderskriverResponse, ISetMedunderskriverParams>({
      query: ({ oppgaveId, employee }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/medunderskrivernavident`,
        method: 'PUT',
        body: {
          navIdent: employee?.navIdent ?? null,
        },
      }),
      onQueryStarted: async ({ oppgaveId, employee }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.medunderskriver.employee?.navIdent === employee?.navIdent) {
              return draft;
            }

            draft.medunderskriver.employee = employee;

            if (draft.medunderskriver.flowState === FlowState.RETURNED) {
              draft.medunderskriver.flowState = FlowState.NOT_SENT;
            }
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
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useSetMedunderskriverMutation } = setMedunderskriverMutationSlice;
