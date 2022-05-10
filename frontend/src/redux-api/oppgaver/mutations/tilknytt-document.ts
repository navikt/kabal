import { ICheckDocumentParams } from '../../../types/oppgavebehandling/params';
import { ITilknyttDocumentResponse } from '../../../types/oppgavebehandling/response';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
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
              })
            )
          )
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
        } catch {
          patchResults.forEach(({ undo }) => undo());
          patchResult.undo();
        }
      },
    }),
  }),
});

export const { useTilknyttDocumentMutation } = tilknyttDokumentMutationSlice;
