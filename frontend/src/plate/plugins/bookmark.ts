import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { hasOwn } from '@app/functions/object';
import { Keys } from '@app/keys';
import { BookmarkLeaf } from '@app/plate/leaf/bookmark';
import { BookmarkVariantEnum, isBookmarkVariant } from '@app/plate/toolbar/bookmark-button';
import type { FormattedText } from '@app/plate/types';
import { createPlatePlugin, type PlateEditor } from '@platejs/core/react';
import { type NodeEntry, RangeApi, TextApi } from 'platejs';

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
      const bookmarks = Object.entries(node).filter(([key]) => key.startsWith(BOOKMARK_PREFIX));
      const hasBookmarks = bookmarks.length > 0;

      if (hasBookmarkMark && !hasBookmarks) {
        // Node has the basic bookmark mark, but no specific bookmarks. Remove the basic bookmark mark.
        editor.tf.unsetNodes(BookmarkPlugin.key, { at: path, match: (n) => n === node, split: true });
      } else if (!hasBookmarkMark && hasBookmarks) {
        // Node has bookmarks, but is missing the basic bookmark mark. Add the basic bookmark mark.
        editor.tf.setNodes({ [BookmarkPlugin.key]: true }, { at: path, match: (n) => n === node, split: true });
      }

      if (hasBookmarks) {
        migrateBookmarks(editor, entry, bookmarks);
      }
    }

    normalizeNode(entry);
  };

  return editor;
});

/**
 * Migrate legacy bookmarks to the new format.
 * Delete when no documents with legacy bookmarks remain.
 */
const migrateBookmarks = (editor: PlateEditor, [node, path]: NodeEntry, bookmarks: [string, unknown][]) => {
  for (const [key, value] of bookmarks) {
    if (typeof value !== 'string') {
      editor.tf.removeMark(key);
      continue;
    }

    if (isBookmarkVariant(value)) {
      continue;
    }

    const variant = LEGACY_COLOR_TO_VARIANT[value];

    if (variant === undefined) {
      continue;
    }

    editor.tf.setNodes({ [key]: variant }, { at: path, match: (n) => n === node });
  }
};

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

const LEGACY_COLOR_TO_VARIANT: Record<string, BookmarkVariantEnum> = {
  'var(--ax-bg-danger-strong)': BookmarkVariantEnum.RED,
  'var(--ax-bg-success-strong)': BookmarkVariantEnum.GREEN,
  'var(--ax-bg-accent-strong)': BookmarkVariantEnum.PURPLE,
  'var(--a-red-600)': BookmarkVariantEnum.RED,
  'var(--a-green-600)': BookmarkVariantEnum.GREEN,
  'var(--a-blue-600)': BookmarkVariantEnum.PURPLE,
};
