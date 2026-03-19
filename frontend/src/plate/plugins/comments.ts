import { TextApi } from 'platejs';
import { createPlatePlugin, type PlateEditor } from 'platejs/react';
import { COMMENT_PREFIX } from '@/components/smart-editor/constants';
import { hasOwn } from '@/functions/object';
import { Keys } from '@/keys';
import { CommentLeaf } from '@/plate/leaf/comment';
import type { FormattedText } from '@/plate/types';

export const CommentsPlugin = createPlatePlugin({
  key: 'comments',
  node: { isLeaf: true },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.key === Keys.Escape) {
        removeCommentMarks(editor);
      }
    },
  },
  render: {
    node: CommentLeaf,
  },
}).overrideEditor(({ editor }) => {
  const { insertBreak, normalizeNode } = editor.tf;

  editor.tf.insertBreak = () => {
    removeCommentMarks(editor);

    insertBreak();
  };

  editor.tf.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (TextApi.isText(node)) {
      const hasCommentMark = hasOwn(node, CommentsPlugin.key) && node[CommentsPlugin.key] === true;
      const shouldHaveCommentMark = Object.keys(node).some((key) => key.startsWith(COMMENT_PREFIX));

      if (hasCommentMark && !shouldHaveCommentMark) {
        editor.tf.unsetNodes(CommentsPlugin.key, { at: path, match: (n) => n === node, split: true });
      } else if (!hasCommentMark && shouldHaveCommentMark) {
        editor.tf.setNodes({ [CommentsPlugin.key]: true }, { at: path, match: (n) => n === node, split: true });
      }
    }

    normalizeNode(entry);
  };

  return editor;
});

const removeCommentMarks = (editor: PlateEditor) => {
  const entry = editor.api.node<FormattedText>({ match: TextApi.isText });

  if (entry === undefined) {
    return;
  }

  const [node] = entry;

  editor.tf.withoutNormalizing(() => {
    for (const key of Object.keys(node)) {
      if (key.startsWith(COMMENT_PREFIX)) {
        editor.tf.removeMark(key);
      }
    }
  });
};
