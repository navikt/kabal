import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { hasOwn } from '@app/functions/object';
import { BookmarkLeaf } from '@app/plate/leaf/bookmark';
import type { FormattedText } from '@app/plate/types';
import { findNode, isCollapsed, isText, setNodes, unsetNodes, withoutNormalizing } from '@udecode/plate-common';
import { type PlateEditor, createPlatePlugin } from '@udecode/plate-core/react';

export const BookmarkPlugin = createPlatePlugin({
  key: 'bookmark',
  node: { isLeaf: true },
  extendEditor: ({ editor }) => {
    const { insertBreak } = editor;

    editor.insertBreak = () => {
      removeBookmarkMarks(editor);

      insertBreak();
    };

    const { normalizeNode } = editor;

    editor.normalizeNode = (entry) => {
      const [node, path] = entry;

      if (isText(node)) {
        const hasBookmarkMark = hasOwn(node, BookmarkPlugin.key) && node[BookmarkPlugin.key] === true;
        const shouldHaveBookmarkMark = Object.keys(node).some((key) => key.startsWith(BOOKMARK_PREFIX));

        if (hasBookmarkMark && !shouldHaveBookmarkMark) {
          unsetNodes(editor, BookmarkPlugin.key, { at: path, match: (n) => n === node, split: true });
        } else if (!hasBookmarkMark && shouldHaveBookmarkMark) {
          setNodes(editor, { [BookmarkPlugin.key]: true }, { at: path, match: (n) => n === node, split: true });
        }
      }

      normalizeNode(entry);
    };

    return editor;
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.key === 'Escape' && isCollapsed(editor.selection)) {
        removeBookmarkMarks(editor);
      }
    },
  },
  render: {
    node: BookmarkLeaf,
  },
});

const removeBookmarkMarks = (editor: PlateEditor) => {
  const entry = findNode<FormattedText>(editor, { match: isText });

  if (entry === undefined) {
    return;
  }

  const [node] = entry;

  withoutNormalizing(editor, () => {
    for (const key of Object.keys(node)) {
      if (key.startsWith(BOOKMARK_PREFIX)) {
        editor.removeMark(key);
      }
    }
  });
};
