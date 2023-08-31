import { behandlingerQuerySlice } from '@app/redux-api/oppgaver/queries/behandling';
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
          medunderskriver,
          avsluttetAvSaksbehandlerDate,
          isAvsluttetAvSaksbehandler,
          frist,
          sattPaaVent,
          ytelseId,
          rol,
        } = data;

        dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => ({
            ...draft,
            tildeltSaksbehandlerident,
            medunderskriver,
            avsluttetAvSaksbehandlerDate,
            isAvsluttetAvSaksbehandler,
            frist,
            sattPaaVent,
            ytelseId,
            rol,
          })),
        );
      },
    }),
  }),
});

export const { useGetOppgaveQuery } = oppgaveDataQuerySlice;
