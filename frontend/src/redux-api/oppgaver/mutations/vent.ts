import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { toast } from '@app/components/toast/store';
import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { oppgaveDataQuerySlice } from '@app/redux-api/oppgaver/queries/oppgave-data';
import { isApiRejectionError } from '@app/types/errors';
import type { ISettPaaVentParams } from '@app/types/oppgavebehandling/params';
import type { IModifiedResponse } from '@app/types/oppgavebehandling/response';
import { format } from 'date-fns';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const ventMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
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
        } catch (error) {
          behandlingPatchResult.undo();
          oppgavePatchResult.undo();

          const heading = 'Kunne ikke sette på vent';
          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
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
        } catch (error) {
          patchResult.undo();

          const heading = 'Kunne ikke fjerne satt på vent';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
          }
        }
      },
    }),
  }),
});

export const { useSattPaaVentMutation, useDeleteSattPaaVentMutation } = ventMutationSlice;
