import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { formatEmployeeNameAndId } from '@app/domain/employee-name';
import { ENVIRONMENT } from '@app/environment';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { FlowState } from '@app/types/oppgave-common';
import type { ISetRolParams } from '@app/types/oppgavebehandling/params';
import type { ISetRolResponse } from '@app/types/oppgavebehandling/response';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

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
        } catch (error) {
          patchResult.undo();

          const isRemove = employee === null;
          const heading = isRemove ? 'Kunne ikke fjerne rådgivende overlege' : 'Kunne ikke endre rådgivende overlege';
          const description = isRemove
            ? undefined
            : `Kunne ikke sette ${formatEmployeeNameAndId(employee)} som rådgivende overlege.`;

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

export const { useSetRolMutation } = setRolMutationSlice;
