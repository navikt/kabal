import { ICheckDocumentParams } from '../../../types/oppgavebehandling/params';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';

const removeTilknyttDocumentMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    removeTilknyttetDocument: builder.mutation<{ modified: string }, ICheckDocumentParams>({
      query: ({ oppgaveId, journalpostId, dokumentInfoId }) => ({
        url: `/kabal-api/klagebehandlinger/${oppgaveId}/dokumenttilknytninger/${journalpostId}/${dokumentInfoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['tilknyttedeDokumenter'],
      onQueryStarted: async (
        { oppgaveId, journalpostId, dokumentInfoId, pageReferences, temaer },
        { dispatch, queryFulfilled }
      ) => {
        const patchResults = pageReferences.map((pageReference) =>
          dispatch(
            documentsQuerySlice.util.updateQueryData(
              'getArkiverteDokumenter',
              { oppgaveId, pageReference, temaer },
              (draft) => ({
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
              })
            )
          )
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
        } catch {
          patchResults.forEach(({ undo }) => undo());
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useRemoveTilknyttetDocumentMutation } = removeTilknyttDocumentMutationSlice;
