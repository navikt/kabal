import { createPlatePlugin } from 'platejs/react';
import { isMetaKey, Keys } from '@/keys';
import { PageBreak } from '@/plate/components/page-break';
import { ELEMENT_PAGE_BREAK } from '@/plate/plugins/element-types';
import { isInTable, isPlaceholderActive } from '@/plate/utils/queries';
import { insertPageBreak } from '@/plate/utils/transforms';

export const PageBreakPlugin = createPlatePlugin({
  key: ELEMENT_PAGE_BREAK,
  node: {
    isElement: true,
    isVoid: true,
    component: PageBreak,
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (isMetaKey(event) && event.key === Keys.Enter && !isPlaceholderActive(editor)) {
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
