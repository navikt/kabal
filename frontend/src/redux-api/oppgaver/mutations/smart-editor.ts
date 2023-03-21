import { ICreateSmartDocumentParams, IUpdateSmartDocumentParams } from '../../../types/smart-editor/params';
import { ISmartEditor } from '../../../types/smart-editor/smart-editor';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';
import { documentsQuerySlice } from '../queries/documents';
import { smartEditorQuerySlice } from '../queries/smart-editor';

const smartEditorMutationSlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    createSmartDocument: builder.mutation<ISmartEditor, ICreateSmartDocumentParams>({
      query: ({ oppgaveId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
        method: 'POST',
        body,
      }),
      onQueryStarted: async ({ oppgaveId }, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled;
        dispatch(
          documentsQuerySlice.util.updateQueryData('getDocuments', oppgaveId, (draft) => [
            {
              id: data.id,
              dokumentTypeId: data.dokumentTypeId,
              isMarkertAvsluttet: false,
              isSmartDokument: true,
              opplastet: data.created,
              parent: data.parent,
              templateId: data.templateId,
              tittel: data.tittel,
            },
            ...draft,
          ])
        );
        dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) => [...draft, data])
        );
      },
    }),

    updateSmartEditor: builder.mutation<ISmartEditor, IUpdateSmartDocumentParams>({
      query: ({ oppgaveId, dokumentId, ...body }) => ({
        url: `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}`,
        method: 'PATCH',
        body,
      }),
      onQueryStarted: async ({ dokumentId, oppgaveId, ...update }, { dispatch, queryFulfilled }) => {
        const patchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { dokumentId, oppgaveId }, (draft) => {
            if (draft !== null) {
              return {
                ...draft,
                ...update,
              };
            }
          })
        );

        const listPatchResult = dispatch(
          smartEditorQuerySlice.util.updateQueryData('getSmartEditors', { oppgaveId }, (draft) =>
            draft.map((e) => (e.id === dokumentId ? { ...e, ...update } : e))
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            smartEditorQuerySlice.util.updateQueryData('getSmartEditor', { dokumentId, oppgaveId }, (draft) => {
              if (draft !== null) {
                return {
                  ...draft,
                  ...data,
                };
              }

              return data;
            })
          );
        } catch {
          patchResult.undo();
          listPatchResult.undo();
        }
      },
    }),
  }),
});

export const { useCreateSmartDocumentMutation, useUpdateSmartEditorMutation } = smartEditorMutationSlice;
