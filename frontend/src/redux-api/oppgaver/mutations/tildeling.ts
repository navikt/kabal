import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { ISaksbehandler } from '@app/types/oppgave-common';
import { ITildelingResponse, TildelSaksbehandlerParams } from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
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
          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.tildeltSaksbehandlerident = data.saksbehandler?.navIdent ?? null;
              draft.tildeltSaksbehandlerNavn = data.saksbehandler?.navn ?? null;
            })
          );
        } catch {
          optimisticBehandling.undo();
          optimiticSaksbehandler.undo();
        }
      },
    }),
  }),
});

export const { useTildelSaksbehandlerMutation } = tildelMutationSlice;
