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
      query: ({ oppgaveId, medunderskriver }) => ({
        url: `/kabal-api/klagebehandlinger/${oppgaveId}/medunderskriverident`,
        method: 'PUT',
        body: {
          medunderskriverident: medunderskriver === null ? null : medunderskriver.navIdent,
        },
      }),
      onQueryStarted: async ({ oppgaveId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.medunderskriver = update.medunderskriver;
            draft.medunderskriverFlyt = MedunderskriverFlyt.IKKE_SENDT;
          })
        );

        const medunderskriverPatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getMedunderskriver', oppgaveId, (draft) => {
            draft.medunderskriver = update.medunderskriver;
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
              draft.medunderskriverident = update.medunderskriver?.navIdent ?? null;
              draft.medunderskriverNavn = update.medunderskriver?.navn ?? null;
            })
          );
        } catch (e) {
          patchResult.undo();
          medunderskriverPatchResult.undo();
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
