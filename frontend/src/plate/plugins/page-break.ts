import { PageBreak } from '@app/plate/components/page-break';
import { isInTable } from '@app/plate/utils/queries';
import { insertPageBreak } from '@app/plate/utils/transforms';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { ELEMENT_PAGE_BREAK } from './element-types';

export const PageBreakPlugin = createPlatePlugin({
  key: ELEMENT_PAGE_BREAK,
  node: {
    isElement: true,
    isVoid: true,
    component: PageBreak,
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        insertPageBreak(editor);
      }
    },
  },
}).overrideEditor(({ editor }) => {
  const { insertNode } = editor.tf;

  editor.tf.insertNode = (node) => {
    if (node.type === ELEMENT_PAGE_BREAK && isInTable(editor)) {
      return;
    }

    insertNode(node);
  };

  return editor;
});
