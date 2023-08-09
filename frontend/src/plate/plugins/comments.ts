import { AnyObject, createPluginFactory, findNode, isText, withoutNormalizing } from '@udecode/plate-common';
import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { EditorValue, RichText, RichTextEditor } from '@app/plate/types';

const withOverrides = (editor: RichTextEditor) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    removeCommentMarks(editor);

    insertBreak();
  };

  return editor;
};

export const createCommentsPlugin = createPluginFactory<AnyObject, EditorValue, RichTextEditor>({
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

const removeCommentMarks = (editor: RichTextEditor) => {
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
