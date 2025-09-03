import { apiErrorToast, apiRejectionErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { ENVIRONMENT } from '@app/environment';
import type { IDocumentParams } from '@app/types/documents/common-params';
import { isApiRejectionError } from '@app/types/errors';
import type { Language } from '@app/types/texts/language';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

const smartDocumentsMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: ENVIRONMENT.isLocal,
  endpoints: (builder) => ({
    setLanguage: builder.mutation<void, IDocumentParams & { language: Language }>({
      query: ({ dokumentId, oppgaveId, language }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/dokumenter/${dokumentId}/language`,
        method: 'PUT',
        body: { language },
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId, language }, { dispatch, queryFulfilled }) => {
        const getDocumentPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocument', { dokumentId, oppgaveId }, (draft) => {
            if (draft.isSmartDokument) {
              return { ...draft, language };
            }
          }),
        );

        const getDocumentsPatchResult = dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) =>
            draft.map((d) => (d.isSmartDokument && d.id === dokumentId ? { ...d, language } : d)),
          ),
        );

        try {
          await queryFulfilled;
        } catch (error) {
          getDocumentPatchResult.undo();
          getDocumentsPatchResult.undo();

          const heading = 'Kunne ikke endre språk';
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

export const { useSetLanguageMutation } = smartDocumentsMutationSlice;
