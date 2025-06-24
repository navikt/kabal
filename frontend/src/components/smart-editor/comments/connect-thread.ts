import { COMMENT_PREFIX } from '@app/components/smart-editor/constants';
import { CommentsPlugin } from '@app/plate/plugins/comments';
import type { RichTextEditor, RootElement } from '@app/plate/types';
import { TextApi } from 'platejs';
import type { Selection } from 'slate';

export const connectCommentThread = (editor: RichTextEditor, selection: Selection, threadId: string) => {
  editor.tf.setNodes(
    { [CommentsPlugin.key]: true, [COMMENT_PREFIX + threadId]: true },
    {
      match: TextApi.isText,
      mode: 'lowest',
      split: true,
      hanging: true,
      at: selection ?? undefined,
    },
  );
};

export const disconnectCommentThread = (editor: RichTextEditor, threadId: string) => {
  const key = COMMENT_PREFIX + threadId;

  editor.tf.unsetNodes<RootElement>(key, {
    match: (node) => Object.hasOwn(node, key),
    split: true,
    at: [],
  });
};
