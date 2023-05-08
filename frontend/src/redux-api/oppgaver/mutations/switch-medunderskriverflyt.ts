import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { MedunderskriverFlyt } from '@app/types/kodeverk';
import {
  ISwitchMedunderskriverflytParams,
  ISwitchMedunderskriverflytResponse,
} from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const switchMedunderskriverMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    switchMedunderskriverflyt: builder.mutation<ISwitchMedunderskriverflytResponse, ISwitchMedunderskriverflytParams>({
      query: ({ oppgaveId }) => ({
        url: `/kabal-api/klagebehandlinger/${oppgaveId}/send`,
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
              draft.modified = data.modified;
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );

          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.medunderskriverFlyt = data.medunderskriverFlyt;
            })
          );
        } catch {
          oppgavePatchResult.undo();
          flytPatchresult.undo();
        }
      },
    }),
  }),
});

export const { useSwitchMedunderskriverflytMutation } = switchMedunderskriverMutationSlice;
