import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { behandlingerQuerySlice } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { isApiRejectionError } from '@app/types/errors';
import type { ICheckDocumentParams } from '@app/types/oppgavebehandling/params';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';

const removeTilknyttDocumentMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    removeTilknyttetDocument: builder.mutation<{ modified: string }, ICheckDocumentParams>({
      query: ({ oppgaveId, journalpostId, dokumentInfoId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenttilknytninger/${journalpostId}/${dokumentInfoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, { journalpostId, dokumentInfoId }) => [
        { type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: `${journalpostId}-${dokumentInfoId}` },
        { type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: ListTagTypes.PARTIAL_LIST },
      ],
      onQueryStarted: async ({ oppgaveId, dokumentInfoId, journalpostId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => ({
            ...draft,
            tilknyttedeDokumenter: draft.tilknyttedeDokumenter.filter(
              (d) => d.journalpostId !== journalpostId || d.dokumentInfoId !== dokumentInfoId,
            ),
          })),
        );

        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();

          const message = 'Kunne ikke fjerne dokument.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }
        }
      },
    }),
    removeAllTilknyttedeDocuments: builder.mutation<void, { oppgaveId: string }>({
      query: ({ oppgaveId }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenttilknytninger`,
        method: 'DELETE',
      }),
      invalidatesTags: () => [{ type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: ListTagTypes.PARTIAL_LIST }],
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => ({
            ...draft,
            tilknyttedeDokumenter: [],
          })),
        );

        try {
          await queryFulfilled;
        } catch (e) {
          patchResult.undo();

          const message = 'Kunne ikke fjerne dokumenter.';

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

export const { useRemoveTilknyttetDocumentMutation, useRemoveAllTilknyttedeDocumentsMutation } =
  removeTilknyttDocumentMutationSlice;
