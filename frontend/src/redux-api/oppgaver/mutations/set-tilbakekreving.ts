import { ENVIRONMENT } from '@app/environment';
import { oppgaverApi } from '@app/redux-api/oppgaver/oppgaver';
import { behandlingerQuerySlice } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import type { SetTilbakekrevingParams } from '@app/types/oppgavebehandling/params';
import type { IModifiedResponse } from '@app/types/oppgavebehandling/response';

const setTilbakekrevingMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
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
        } catch {
          oppgavePatchResult.undo();
        }
      },
    }),
  }),
});

export const { useSetTilbakekrevingMutation } = setTilbakekrevingMutationSlice;
