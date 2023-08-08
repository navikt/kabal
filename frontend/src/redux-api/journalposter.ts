import { PatchCollection } from '@reduxjs/toolkit/dist/query/core/buildThunks';
import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { DocumentTypeEnum, IJournalpostReference } from '@app/types/documents/documents';
import { KABAL_API_BASE_QUERY } from './common';
import { documentsQuerySlice } from './oppgaver/queries/documents';

interface ISetTitleUpdate {
  journalpostId: string;
  dokumentInfoId: string;
  oppgaveId: string;
  tittel: string;
  journalpostList: IJournalpostReference[];
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
      onQueryStarted: async ({ tittel, dokumentInfoId, oppgaveId, journalpostList }, { dispatch, queryFulfilled }) => {
        const journalfoertePatchResults: PatchCollection[] = [];

        for (const jp of journalpostList) {
          if (jp.dokumentInfoId === dokumentInfoId) {
            const patch = dispatch(
              documentsQuerySlice.util.updateQueryData(
                'getDocument',
                { journalpostId: jp.journalpostId, dokumentInfoId },
                (draft) => ({ ...draft, title: tittel }),
              ),
            );

            journalfoertePatchResults.push(patch);

            break;
          }

          for (const v of jp.vedlegg) {
            if (v !== dokumentInfoId) {
              continue;
            }

            const patch = dispatch(
              documentsQuerySlice.util.updateQueryData(
                'getDocument',
                { journalpostId: jp.journalpostId, dokumentInfoId },
                (draft) => ({ ...draft, title: tittel }),
              ),
            );

            journalfoertePatchResults.push(patch);

            break;
          }
        }

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
        } catch {
          journalfoertePatchResults.forEach(({ undo }) => undo());
          underArbeidPatchResult.undo();
        }
      },
    }),
  }),
});

export const { useSetTitleMutation } = journalposterApi;
