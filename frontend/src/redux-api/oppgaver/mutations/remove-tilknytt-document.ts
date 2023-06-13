import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import { ICheckDocumentParams } from '@app/types/oppgavebehandling/params';
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
      onQueryStarted: async ({ oppgaveId, journalpostId, dokumentInfoId }, { dispatch, queryFulfilled }) => {
        const archiveResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, (draft) => ({
            ...draft,
            dokumenter: draft.dokumenter.map((d) => {
              if (d.journalpostId === journalpostId) {
                if (d.dokumentInfoId === dokumentInfoId) {
                  return { ...d, valgt: false };
                }

                return {
                  ...d,
                  vedlegg: d.vedlegg.map((v) => {
                    if (v.dokumentInfoId === dokumentInfoId) {
                      return { ...v, valgt: false };
                    }

                    return v;
                  }),
                };
              }

              return d;
            }),
          }))
        );

        const patchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getTilknyttedeDokumenter', oppgaveId, (draft) => {
            draft.dokumenter = draft.dokumenter
              .filter((d) => !(d.dokumentInfoId === dokumentInfoId && d.journalpostId === journalpostId))
              .map((d) => ({
                ...d,
                vedlegg: d.vedlegg.filter(
                  (v) => !(v.dokumentInfoId === dokumentInfoId && d.journalpostId === journalpostId)
                ),
              }));
          })
        );

        try {
          await queryFulfilled;
        } catch (e) {
          archiveResult.undo();
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
