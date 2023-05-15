import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { isApiRejectionError } from '@app/types/errors';
import { ICheckDocumentParams } from '@app/types/oppgavebehandling/params';
import { ITilknyttDocumentResponse } from '@app/types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { ListTagTypes } from '../../tag-types';
import { DokumenterListTagTypes, oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

const tilknyttDokumentMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    tilknyttDocument: builder.mutation<ITilknyttDocumentResponse, ICheckDocumentParams>({
      query: ({ oppgaveId, dokumentInfoId, journalpostId }) => ({
        url: `/kabal-api/klagebehandlinger/${oppgaveId}/dokumenttilknytninger`,
        method: 'POST',
        body: {
          journalpostId,
          dokumentInfoId,
        },
        validateStatus: ({ ok }) => ok,
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
                  return { ...d, valgt: true };
                }

                return {
                  ...d,
                  vedlegg: d.vedlegg.map((v) => {
                    if (v.dokumentInfoId === dokumentInfoId) {
                      return { ...v, valgt: true };
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
            draft.dokumenter = draft.dokumenter.map((d) => {
              if (d.journalpostId === journalpostId) {
                if (d.dokumentInfoId === dokumentInfoId) {
                  return { ...d, valgt: true };
                }

                return {
                  ...d,
                  vedlegg: d.vedlegg.map((v) => {
                    if (v.dokumentInfoId === dokumentInfoId) {
                      return { ...v, valgt: true };
                    }

                    return v;
                  }),
                };
              }

              return d;
            });
          })
        );

        try {
          await queryFulfilled;
        } catch (e) {
          archiveResult.undo();
          patchResult.undo();

          const message = 'Kunne ikke tilknytte dokument.';

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

export const { useTilknyttDocumentMutation } = tilknyttDokumentMutationSlice;
