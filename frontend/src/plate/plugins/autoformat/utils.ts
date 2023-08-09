import { AutoformatBlockRule } from '@udecode/plate-autoformat';
import { getParentNode, isElement } from '@udecode/plate-common';
import { toggleList, unwrapList } from '@udecode/plate-list';
import { EditorValue, RichTextEditor } from '../../types';

export const preFormat: AutoformatBlockRule<EditorValue, RichTextEditor>['preFormat'] = (editor) => unwrapList(editor);

const format = (editor: RichTextEditor, customFormatting: () => void) => {
  if (editor.selection) {
    const parentEntry = getParentNode(editor, editor.selection);

    if (!parentEntry) {
      return;
    }
    const [node] = parentEntry;

    if (isElement(node)) {
      customFormatting();
    }
  }
};

export const formatList = (editor: RichTextEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    }),
  );
};
