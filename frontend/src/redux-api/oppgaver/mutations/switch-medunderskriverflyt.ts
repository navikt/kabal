import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import { ISwitchMedunderskriverflytParams } from '@app/types/oppgavebehandling/params';
import { ISwitchMedunderskriverflytResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const switchMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytResponse, ISwitchMedunderskriverflytParams>({
      query: ({ oppgaveId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/send`,
        method: 'POST',
        validateStatus: ({ ok }) => ok,
      }),
      onQueryStarted: async ({ oppgaveId, isSaksbehandler }, { dispatch, queryFulfilled }) => {
        const oppgavePatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.medunderskriverFlyt = isSaksbehandler
              ? MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER
              : MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER;
          })
        );

        const flytPatchresult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getMedunderskriverflyt', oppgaveId, (draft) => {
            draft.medunderskriverFlyt = isSaksbehandler
              ? MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER
              : MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER;
          })
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              const { modified, medunderskriverFlyt, ...medunderskriver } = data;
              draft.modified = modified;
              draft.medunderskriverFlyt = medunderskriverFlyt;
              draft.medunderskriver = medunderskriver;
            })
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
              draft.medunderskriverNavn = data.navn;
              draft.medunderskriverident = data.navIdent;
            })
          );
        } catch (e) {
          oppgavePatchResult.undo();
          flytPatchresult.undo();

          const message = isSaksbehandler
            ? 'Kunne ikke sende til medunderskriver.'
            : 'Kunne ikke returnere til saksbehandler.';

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

export const { useSwitchMedunderskriverflytMutation } = switchMedunderskriverMutationSlice;
