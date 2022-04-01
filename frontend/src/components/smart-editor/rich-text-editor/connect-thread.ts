import { Editor, Selection, Text, Transforms } from 'slate';

export const connectCommentThread = (editor: Editor, selection: Selection, threadId: string) => {
  Transforms.setNodes(
    editor,
    { [`commentThreadId_${threadId}`]: true },
    {
      match: Text.isText,
      mode: 'lowest',
      split: true,
      hanging: true,
      at: selection ?? undefined,
    }
  );
};
