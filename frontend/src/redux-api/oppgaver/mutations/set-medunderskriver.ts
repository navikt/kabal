import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { formatEmployeeNameAndId } from '@app/domain/employee-name';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { FlowState } from '@app/types/oppgave-common';
import type { ISetMedunderskriverParams } from '@app/types/oppgavebehandling/params';
import type { ISetMedunderskriverResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
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
        } catch (error) {
          patchResult.undo();

          const isRemove = employee === null;
          const heading = isRemove ? 'Kunne ikke fjerne medunderskriver' : 'Kunne ikke sette medunderskriver';
          const description = isRemove
            ? undefined
            : `Kunne ikke sette ${formatEmployeeNameAndId(employee)} som medunderskriver.`;

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error, description);
          } else {
            apiErrorToast(heading, description);
          }
        }
      },
    }),
  }),
});

export const { useSetMedunderskriverMutation } = setMedunderskriverMutationSlice;
