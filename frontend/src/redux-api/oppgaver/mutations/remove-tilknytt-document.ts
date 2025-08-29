import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { behandlingerQuerySlice } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { isApiRejectionError } from '@app/types/errors';
import type { IBatchDocumentParams } from '@app/types/oppgavebehandling/params';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';

const removeTilknyttDocumentMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    removeTilknyttedeDocuments: builder.mutation<void, IBatchDocumentParams>({
      query: ({ oppgaveId, documentIdList }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenttilknytninger`,
        method: 'DELETE',
        body: { journalfoertDokumentReferenceSet: documentIdList },
      }),
      invalidatesTags: (_, __, { documentIdList }) => [
        ...documentIdList.map((d) => ({
          type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER,
          id: `${d.journalpostId}-${d.dokumentInfoId}`,
        })),
        { type: DokumenterListTagTypes.TILKNYTTEDEDOKUMENTER, id: ListTagTypes.PARTIAL_LIST },
      ],
      onQueryStarted: async ({ oppgaveId, documentIdList }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          behandlingerQuerySlice.util.updateQueryData('getOppgavebehandling', oppgaveId, (draft) => ({
            ...draft,
            tilknyttedeDokumenter: draft.tilknyttedeDokumenter.filter((d) =>
              documentIdList.some((r) => d.journalpostId !== r.journalpostId || d.dokumentInfoId !== r.dokumentInfoId),
            ),
          })),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();

          const heading = `Kunne ikke fjerne ${documentIdList.length === 1 ? 'dokument' : 'dokumenter'}`;

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(heading, error);
          } else {
            apiErrorToast(heading);
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
        } catch (error) {
          patchResult.undo();

          const message = 'Kunne ikke fjerne dokumenter';

          if (isApiRejectionError(error)) {
            apiRejectionErrorToast(message, error);
          } else {
            apiErrorToast(message);
          }
        }
      },
    }),
  }),
});

export const { useRemoveTilknyttedeDocumentsMutation, useRemoveAllTilknyttedeDocumentsMutation } =
  removeTilknyttDocumentMutationSlice;
