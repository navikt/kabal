import { toast } from '@app/components/toast/store';
import { apiErrorToast } from '@app/components/toast/toast-content/fetch-error-toast';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { isApiRejectionError } from '@app/types/errors';
import { createApi } from '@reduxjs/toolkit/query/react';
import { KABAL_API_BASE_QUERY } from './common';
import { documentsQuerySlice } from './oppgaver/queries/documents';

interface ISetTitleUpdate {
  journalpostId: string;
  dokumentInfoId: string;
  oppgaveId: string;
  tittel: string;
}

interface ISetTitleResponse {
  tittel: string;
}

export const journalposterApi = createApi({
  reducerPath: 'journalposterApi',
  baseQuery: KABAL_API_BASE_QUERY,
  endpoints: (builder) => ({
    setTitle: builder.mutation<ISetTitleResponse, ISetTitleUpdate>({
      query: ({ journalpostId, dokumentInfoId, tittel }) => ({
        url: `/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/tittel`,
        method: 'PUT',
        body: { tittel },
      }),
      onQueryStarted: async ({ tittel, dokumentInfoId, oppgaveId }, { dispatch, queryFulfilled }) => {
        const journalfoertePatchResult = dispatch(
          // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
          documentsQuerySlice.util.updateQueryData('getArkiverteDokumenter', oppgaveId, (draft) => {
            for (let i = draft.dokumenter.length - 1; i >= 0; i--) {
              const doc = draft.dokumenter[i];

              if (doc === undefined) {
                continue;
              }

              if (doc.dokumentInfoId === dokumentInfoId) {
                draft.dokumenter[i] = { ...doc, tittel };
              }

              for (let j = doc.vedlegg.length - 1; j >= 0; j--) {
                const vedlegg = doc.vedlegg[j];

                if (vedlegg !== undefined && vedlegg.dokumentInfoId === dokumentInfoId) {
                  doc.vedlegg[j] = { ...vedlegg, tittel };
                }
              }
            }
          }),
        );

        const underArbeidPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => {
            for (let i = draft.length - 1; i >= 0; i--) {
              const doc = draft[i];

              if (
                doc !== undefined &&
                doc.type === DocumentTypeEnum.JOURNALFOERT &&
                doc.journalfoertDokumentReference.dokumentInfoId === dokumentInfoId
              ) {
                draft[i] = { ...doc, tittel };
              }
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch (e) {
          const message = 'Kunne ikke oppdatere tittel.';

          if (isApiRejectionError(e)) {
            apiErrorToast(message, e.error);
          } else {
            toast.error(message);
          }

          journalfoertePatchResult.undo();
          underArbeidPatchResult.undo();
        }
      },
    }),
  }),
});

export const { useSetTitleMutation } = journalposterApi;
