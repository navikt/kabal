import { behandlingerQuerySlice } from '@app/redux-api/oppgaver/queries/behandling';
import { IPerson, ISaksbehandler } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

export const oppgaveDataQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getOppgave: builder.query<IOppgave, string>({
      query: (oppgaveId) => `/kabal-search/oppgaver/${oppgaveId}`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;

        const {
          tildeltSaksbehandlerident,
          tildeltSaksbehandlerNavn,
          medunderskriverident,
          medunderskriverNavn,
          medunderskriverFlyt,
        } = data;

        const saksbehandler: ISaksbehandler | null =
          tildeltSaksbehandlerident === null || tildeltSaksbehandlerNavn === null
            ? null
            : { navIdent: tildeltSaksbehandlerident, navn: tildeltSaksbehandlerNavn };

        const medunderskriver: ISaksbehandler | null =
          medunderskriverident === null || medunderskriverNavn === null
            ? null
            : { navIdent: medunderskriverident, navn: medunderskriverNavn };

        dispatch(behandlingerQuerySlice.util.updateQueryData('getSaksbehandler', oppgaveId, () => ({ saksbehandler })));
        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getMedunderskriver', oppgaveId, () => ({ medunderskriver }))
        );
        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getMedunderskriverflyt', oppgaveId, () => ({
            medunderskriverFlyt,
          }))
        );
        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => ({
            ...draft,
            tildeltSaksbehandler: saksbehandler,
            medunderskriver,
            medunderskriverFlyt,
          }))
        );
      },
    }),
    getPerson: builder.query<IPerson, string>({
      query: (oppgaveId) => `/kabal-search/oppgaver/${oppgaveId}/person`,
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getSakenGjelder', oppgaveId, () => ({ sakenGjelder: data }))
        );
      },
    }),
  }),
});

export const { useGetOppgaveQuery, useGetPersonQuery } = oppgaveDataQuerySlice;
