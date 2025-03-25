import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { hasOwn } from '@app/functions/object';
import { Keys } from '@app/keys';
import { BookmarkLeaf } from '@app/plate/leaf/bookmark';
import type { FormattedText } from '@app/plate/types';
import { RangeApi, TextApi } from '@udecode/plate';
import { type PlateEditor, createPlatePlugin } from '@udecode/plate-core/react';

export const BookmarkPlugin = createPlatePlugin({
  key: 'bookmark',
  node: { isLeaf: true },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.key === Keys.Escape && RangeApi.isCollapsed(editor.selection)) {
        removeBookmarkMarks(editor);
      }
    },
  },
  render: {
    node: BookmarkLeaf,
  },
}).overrideEditor(({ editor }) => {
  const { insertBreak, normalizeNode } = editor.tf;

  editor.insertBreak = () => {
    removeBookmarkMarks(editor);

    insertBreak();
  };

  editor.tf.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (TextApi.isText(node)) {
      const hasBookmarkMark = hasOwn(node, BookmarkPlugin.key) && node[BookmarkPlugin.key] === true;
      const shouldHaveBookmarkMark = Object.keys(node).some((key) => key.startsWith(BOOKMARK_PREFIX));

      if (hasBookmarkMark && !shouldHaveBookmarkMark) {
        editor.tf.unsetNodes(BookmarkPlugin.key, { at: path, match: (n) => n === node, split: true });
      } else if (!hasBookmarkMark && shouldHaveBookmarkMark) {
        editor.tf.setNodes({ [BookmarkPlugin.key]: true }, { at: path, match: (n) => n === node, split: true });
      }
    }

    normalizeNode(entry);
  };

  return editor;
});

const removeBookmarkMarks = (editor: PlateEditor) => {
  const entry = editor.api.node<FormattedText>({ match: TextApi.isText });

  if (entry === undefined) {
    return;
  }

  const [node] = entry;

  editor.tf.withoutNormalizing(() => {
    for (const key of Object.keys(node)) {
      if (key.startsWith(BOOKMARK_PREFIX)) {
        editor.tf.removeMark(key);
      }
    }
  });
};
