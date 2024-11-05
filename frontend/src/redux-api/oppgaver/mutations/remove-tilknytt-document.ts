import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import type { ICheckDocumentParams } from '@app/types/oppgavebehandling/params';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

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
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, (draft) => {
            // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
            draft.dokumenter = draft.dokumenter.map((d) => {
              if (d.journalpostId !== journalpostId) {
                return d;
              }

              if (d.dokumentInfoId === dokumentInfoId) {
                return { ...d, valgt: false };
              }

              for (const v of d.vedlegg) {
                if (v.dokumentInfoId === dokumentInfoId) {
                  v.valgt = false;
                  break;
                }
              }

              return d;
            });

            return draft;
          }),
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
  }),
});

export const { useRemoveTilknyttetDocumentMutation } = removeTilknyttDocumentMutationSlice;
