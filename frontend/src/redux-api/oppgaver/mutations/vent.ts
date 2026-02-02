import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { toast } from '@app/components/toast/store';
import { ENVIRONMENT } from '@app/environment';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import type { ISettPaaVentParams } from '@app/types/oppgavebehandling/params';
import type { IModifiedResponse } from '@app/types/oppgavebehandling/response';
import { format } from 'date-fns';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const ventMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    sattPaaVent: builder.mutation<IModifiedResponse, ISettPaaVentParams>({
      query: ({ oppgaveId, sattPaaVent }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/sattpaavent`,
        method: 'POST',
        body: sattPaaVent,
      }),
      onQueryStarted: async ({ oppgaveId, sattPaaVent }, { dispatch, queryFulfilled }) => {
        const now = new Date();
        const venteperiode = { from: format(now, ISO_FORMAT), ...sattPaaVent };

        const behandlingPatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.sattPaaVent = venteperiode;
          }),
        );

        const oppgavePatchResult = dispatch(
          oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
            draft.sattPaaVent = { ...venteperiode, isExpired: false };
          }),
        );

        try {
          await queryFulfilled;
          toast.success('Oppgaven er satt på vent');
        } catch {
          behandlingPatchResult.undo();
          oppgavePatchResult.undo();
        }
      },
    }),
    deleteSattPaaVent: builder.mutation<IModifiedResponse, string>({
      query: (oppgaveId) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/sattpaavent`,
        method: 'DELETE',
      }),
      onQueryStarted: async (oppgaveId, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.sattPaaVent = null;
          }),
        );

        try {
          await queryFulfilled;
          dispatch(
            oppgaveDataQuerySlice.util.updateQueryData('getOppgave', oppgaveId, (draft) => {
              draft.sattPaaVent = null;
            }),
          );
          toast.success('Venteperiode avsluttet.');
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useSattPaaVentMutation, useDeleteSattPaaVentMutation } = ventMutationSlice;
