import type { EditorValue, RichTextEditor } from '@app/plate/types';
import { isInTable } from '@app/plate/utils/queries';
import { insertPageBreak } from '@app/plate/utils/transforms';
import { type AnyObject, createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_PAGE_BREAK } from './element-types';

export const createPageBreakPlugin = createPluginFactory<AnyObject, EditorValue, RichTextEditor>({
  key: ELEMENT_PAGE_BREAK,
  isElement: true,
  isVoid: true,
  handlers: {
    onKeyDown: (editor) => (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        insertPageBreak(editor);
      }
    },
  },
  withOverrides: (editor) => {
    const { insertNode } = editor;

    editor.insertNode = (node) => {
      if (node.type === ELEMENT_PAGE_BREAK && isInTable(editor)) {
        return;
      }

      insertNode(node);
    };

    return editor;
  },
});
