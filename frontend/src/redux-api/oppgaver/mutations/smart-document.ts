import { toast } from '@app/components/toast/store';
import type { IDocumentParams } from '@app/types/documents/common-params';
import type { Language } from '@app/types/texts/language';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

const smartDocumentsMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
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
        } catch {
          getDocumentPatchResult.undo();
          getDocumentsPatchResult.undo();
          toast.error('Feil ved endring av språk.');
        }
      },
    }),
  }),
});

export const { useSetLanguageMutation } = smartDocumentsMutationSlice;
