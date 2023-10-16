import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_LABEL_CONTENT } from '@app/plate/plugins/element-types';
import { TextAlign } from '@app/plate/types';
import { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';
import { IGetSmartEditorParams } from '@app/types/smart-editor/params';
import { ISmartEditor } from '@app/types/smart-editor/smart-editor';
import { IS_LOCALHOST } from '../../common';
import { oppgaverApi } from '../oppgaver';

// TODO: Remove this when we are sure that there are no documents in progress that was created before 13.10.2023.
const transformResponse = (editor: ISmartEditor) =>
  ({
    ...editor,
    content: editor.content.map((content) => {
      if (content.type === ELEMENT_LABEL_CONTENT) {
        return {
          type: ELEMENT_PARAGRAPH,
          align: TextAlign.LEFT,
          children: [{ text: '' }, content, { text: '' }],
        };
      }

      return content;
    }),
  }) as ISmartEditor;

const transformNullableResponse = (editor: ISmartEditor | null) => {
  if (editor === null) {
    return editor;
  }

  return transformResponse(editor);
};

export const smartEditorQuerySlice = oppgaverApi.injectEndpoints({
  overrideExisting: IS_LOCALHOST,
  endpoints: (builder) => ({
    getSmartEditors: builder.query<ISmartEditor[], IOppgavebehandlingBaseParams>({
      query: ({ oppgaveId }) => `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter`,
      transformResponse: (editors: ISmartEditor[]) => editors.map(transformResponse),
    }),

    getSmartEditor: builder.query<ISmartEditor | null, IGetSmartEditorParams>({
      query: ({ oppgaveId, dokumentId }) => `/kabal-api/behandlinger/${oppgaveId}/smartdokumenter/${dokumentId}`,
      transformResponse: transformNullableResponse,
    }),
  }),
});

export const { useGetSmartEditorsQuery, useLazyGetSmartEditorQuery, useGetSmartEditorQuery } = smartEditorQuerySlice;
