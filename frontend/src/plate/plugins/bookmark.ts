import {
  PlateEditor,
  createPluginFactory,
  findNode,
  isCollapsed,
  isText,
  withoutNormalizing,
} from '@udecode/plate-common';
import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { RichText } from '@app/plate/types';

const withOverrides = (editor: PlateEditor) => {
  const { insertBreak } = editor;

  editor.insertBreak = () => {
    removeBookmarkMarks(editor);

    insertBreak();
  };

  return editor;
};

export const createBookmarkPlugin = createPluginFactory({
  key: 'bookmark',
  withOverrides,
  handlers: {
    onKeyDown: (editor) => (event) => {
      if (event.key === 'Escape' && isCollapsed(editor.selection)) {
        removeBookmarkMarks(editor);
      }
    },
  },
});

const removeBookmarkMarks = (editor: PlateEditor) => {
  const entry = findNode<RichText>(editor, { match: isText });

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
