import { isText, setNodes, unsetNodes } from '@udecode/plate-common';
import { Selection } from 'slate';
import { RichTextEditor, RootElement } from '@app/plate/types';
import { COMMENT_PREFIX } from '../../smart-editor/constants';

export const connectCommentThread = (editor: RichTextEditor, selection: Selection, threadId: string) => {
  setNodes(
    editor,
    { [COMMENT_PREFIX + threadId]: true },
    {
      match: isText,
      mode: 'lowest',
      split: true,
      hanging: true,
      at: selection ?? undefined,
    },
  );
};

export const disconnectCommentThread = (editor: RichTextEditor, threadId: string) => {
  const key = COMMENT_PREFIX + threadId;

  unsetNodes<RootElement>(editor, key, {
    match: (node) => Object.hasOwn(node, key),
    split: true,
    at: [],
  });
};
