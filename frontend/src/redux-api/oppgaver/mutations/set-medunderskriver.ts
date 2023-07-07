import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { ISetMedunderskriverParams } from '@app/types/oppgavebehandling/params';
import { ISettMedunderskriverResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const setMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    updateChosenMedunderskriver: builder.mutation<ISettMedunderskriverResponse, ISetMedunderskriverParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/medunderskriver`,
        method: 'PUT',
        body: {
          navIdent,
        },
      }),
      onQueryStarted: async ({ oppgaveId, navIdent }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.medunderskriverident = navIdent;
            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        const flytPatchresult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getMedunderskriverflyt', oppgaveId, (draft) => {
            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
              draft.medunderskriverident = navIdent;
            })
          );

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getMedunderskriverflyt', oppgaveId, (draft) => {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
              draft.medunderskriverident = navIdent;
            })
          );

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getMedunderskriver', oppgaveId, (draft) => {
              draft.medunderskriver = data.medunderskriver;
            })
          );
        } catch (e) {
          patchResult.undo();
          flytPatchresult.undo();

          const message = 'Kunne ikke oppdatere medunderskriver.';

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

export const { useUpdateChosenMedunderskriverMutation } = setMedunderskriverMutationSlice;
