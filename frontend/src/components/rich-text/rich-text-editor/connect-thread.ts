import { Editor, Selection, Text, Transforms } from 'slate';
import { COMMENT_PREFIX } from '../../smart-editor/constants';

export const connectCommentThread = (editor: Editor, selection: Selection, threadId: string) => {
  Transforms.setNodes(
    editor,
    { [COMMENT_PREFIX + threadId]: true },
    {
      match: Text.isText,
      mode: 'lowest',
      split: true,
      hanging: true,
      at: selection ?? undefined,
    }
  );
};

export const disconnectCommentThread = (editor: Editor, threadId: string) => {
  Transforms.unsetNodes(editor, COMMENT_PREFIX + threadId, {
    match: (node) => typeof node[COMMENT_PREFIX + threadId] !== 'undefined',
    split: true,
    at: [],
  });
};
