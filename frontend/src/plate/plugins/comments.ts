import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { hasOwn } from '@app/functions/object';
import { CommentLeaf } from '@app/plate/leaf/comment';
import type { FormattedText } from '@app/plate/types';
import { findNode, isText, setNodes, unsetNodes, withoutNormalizing } from '@udecode/plate-common';
import { type PlateEditor, createPlatePlugin } from '@udecode/plate-core/react';

export const CommentsPlugin = createPlatePlugin({
  key: 'comments',
  node: { isLeaf: true },
  extendEditor: ({ editor }) => {
    const { insertBreak } = editor;

    editor.insertBreak = () => {
      removeCommentMarks(editor);

      insertBreak();
    };

    const { normalizeNode } = editor;

    editor.normalizeNode = (entry) => {
      const [node, path] = entry;

      if (isText(node)) {
        const hasCommentMark = hasOwn(node, CommentsPlugin.key) && node[CommentsPlugin.key] === true;
        const shouldHaveCommentMark = Object.keys(node).some((key) => key.startsWith(COMMENT_PREFIX));

        if (hasCommentMark && !shouldHaveCommentMark) {
          unsetNodes(editor, CommentsPlugin.key, { at: path, match: (n) => n === node, split: true });
        } else if (!hasCommentMark && shouldHaveCommentMark) {
          setNodes(editor, { [CommentsPlugin.key]: true }, { at: path, match: (n) => n === node, split: true });
        }
      }

      normalizeNode(entry);
    };

    return editor;
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.key === 'Escape') {
        removeCommentMarks(editor);
      }
    },
  },
  render: {
    node: CommentLeaf,
  },
});

const removeCommentMarks = (editor: PlateEditor) => {
  const entry = findNode<FormattedText>(editor, { match: isText });

  if (entry === undefined) {
    return;
  }

  const [node] = entry;

  withoutNormalizing(editor, () => {
    for (const key of Object.keys(node)) {
      if (key.startsWith(COMMENT_PREFIX)) {
        editor.removeMark(key);
      }
    }
  });
};
