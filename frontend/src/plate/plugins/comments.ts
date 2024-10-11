import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import type { RichText } from '@app/plate/types';
import { type PlateEditor, createPluginFactory, findNode, isText, withoutNormalizing } from '@udecode/plate-common';

const withOverrides = (editor: PlateEditor) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    removeCommentMarks(editor);

    insertBreak();
  };

  return editor;
};

export const createCommentsPlugin = createPluginFactory({
  key: 'comments',
  withOverrides,
  handlers: {
    onKeyDown: (editor) => (event) => {
      if (event.key === 'Escape') {
        removeCommentMarks(editor);
      }
    },
  },
});

const removeCommentMarks = (editor: PlateEditor) => {
  const entry = findNode<RichText>(editor, { match: isText });

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
