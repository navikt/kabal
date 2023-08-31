import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { FlowState } from '@app/types/oppgave-common';
import { ISetRolParams } from '@app/types/oppgavebehandling/params';
import { ISetRolResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const setRolMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setRol: builder.mutation<ISetRolResponse, ISetRolParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/rolnavident`,
        method: 'PUT',
        body: { navIdent },
      }),
      onQueryStarted: async ({ oppgaveId, navIdent }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (draft.rol.navIdent === navIdent) {
              return;
            }

            draft.rol.navIdent = navIdent;

            if (draft.rol.flowState === FlowState.RETURNED) {
              draft.rol.flowState = FlowState.NOT_SENT;
            }
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
              draft.rol = rol;
            }),
          );

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getRol', oppgaveId, (draft) => {
              draft.navIdent = rol.navIdent;
              draft.flowState = rol.flowState;
              draft.modified = modified;
            }),
          );
        } catch (e) {
          patchResult.undo();

          const message = 'Kunne ikke oppdatere rådgivende overlege.';

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

export const { useSetRolMutation } = setRolMutationSlice;
