import { MedunderskriverFlyt } from '../../../types/kodeverk';
import { ISetMedunderskriverParams } from '../../../types/oppgavebehandling/params';
import { ISettMedunderskriverResponse } from '../../../types/oppgavebehandling/response';
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
        } catch {
          patchResult.undo();
          medunderskriverPatchResult.undo();
          flytPatchresult.undo();
        }
      },
    }),
  }),
});

export const { useUpdateChosenMedunderskriverMutation } = setMedunderskriverMutationSlice;
