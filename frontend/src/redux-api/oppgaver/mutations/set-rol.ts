import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { ISetRolParams } from '@app/types/oppgavebehandling/params';
import { ISetRolResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setRolMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
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
            if (draft.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
              return draft;
            }

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
              draft.rol.navIdent = data.employee?.navIdent ?? null;
              draft.rol.navn = data.employee?.navn ?? null;
              draft.rol.returnertDate = null;
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
