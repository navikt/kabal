import { ISaksbehandler } from '@app/types/oppgave-common';
import { ITildelingResponse, TildelSaksbehandlerParams } from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { OppgaveListTagTypes, UtgaatteFristerTagTypes, oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling';

const tildelMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    tildelSaksbehandler: builder.mutation<ITildelingResponse, TildelSaksbehandlerParams>({
      query: ({ oppgaveId, navIdent }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/saksbehandler`,
        method: 'PUT',
        body: { navIdent },
      }),
      onQueryStarted: async ({ oppgaveId, navIdent }, { dispatch, queryFulfilled }) => {
        const saksbehandler: ISaksbehandler | null = navIdent === null ? null : { navIdent, navn: 'Laster...' };

        const optimisticBehandling = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            if (typeof draft !== 'undefined') {
              draft.tildeltSaksbehandler = saksbehandler;
            }
          })
        );

        const optimiticSaksbehandler = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({ saksbehandler }))
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({
              saksbehandler: data.saksbehandler,
            }))
          );
          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              if (typeof draft !== 'undefined') {
                draft.tildeltSaksbehandler = data.saksbehandler;
                draft.modified = data.modified;
              }
            })
          );
        } catch {
          optimisticBehandling.undo();
          optimiticSaksbehandler.undo();
        }

        dispatch(getInvalidateAction(OppgaveListTagTypes.TILDELTE_OPPGAVER, oppgaveId));
        dispatch(getInvalidateAction(OppgaveListTagTypes.LEDIGE_OPPGAVER, oppgaveId));
        dispatch(oppgaverApi.util.invalidateTags([UtgaatteFristerTagTypes.ANTALL_LEDIGE_MEDUTGAATTEFRISTER]));
      },
    }),
  }),
});

const getInvalidateAction = (type: OppgaveListTagTypes, id: string) =>
  oppgaverApi.util.invalidateTags([
    { type, id },
    { type, id: ListTagTypes.PARTIAL_LIST },
  ]);

export const { useTildelSaksbehandlerMutation } = tildelMutationSlice;
