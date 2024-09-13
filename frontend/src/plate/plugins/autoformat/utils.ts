import type { AutoformatBlockRule } from '@udecode/plate-autoformat';
import { type PlateEditor, getParentNode, isElement } from '@udecode/plate-common';
import { toggleList, unwrapList } from '@udecode/plate-list';

export const preFormat: AutoformatBlockRule['preFormat'] = (editor) => unwrapList(editor);

const format = (editor: PlateEditor, customFormatting: () => void) => {
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

export const formatList = (editor: PlateEditor, elementType: string) => {
  format(editor, () =>
    toggleList(editor, {
      type: elementType,
    }),
  );
};
