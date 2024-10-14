import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import type { SetTilbakekrevingParams } from '@app/types/oppgavebehandling/params';
import type { IModifiedResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { behandlingerQuerySlice } from '../queries/behandling/behandling';

const setTilbakekrevingMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    setTilbakekreving: builder.mutation<IModifiedResponse, SetTilbakekrevingParams>({
      query: ({ oppgaveId, tilbakekreving }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/tilbakekreving`,
        method: 'PUT',
        body: { tilbakekreving },
      }),
      onQueryStarted: async ({ oppgaveId, tilbakekreving }, { dispatch, queryFulfilled }) => {
        const oppgavePatchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
            draft.tilbakekreving = tilbakekreving;
          }),
        );

        try {
          const { data } = await queryFulfilled;

          dispatch(
            behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => {
              draft.modified = data.modified;
            }),
          );
        } catch (e) {
          oppgavePatchResult.undo();

          const message = 'Kunne ikke oppdatere tilbakekreving.';

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

export const { useSetTilbakekrevingMutation } = setTilbakekrevingMutationSlice;
