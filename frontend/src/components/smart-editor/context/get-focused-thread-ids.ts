import { Editor, Text } from 'slate';
import { ReactEditor } from 'slate-react';

export const getFocusedCommentThreadIds = (editor: Editor | null): string[] => {
  if (editor === null || editor.selection === null) {
    return [];
  }

  if (!ReactEditor.hasRange(editor, editor.selection)) {
    return [];
  }

  const textNodes = Editor.nodes(editor, {
    match: Text.isText,
    reverse: true,
    mode: 'lowest',
  });

  const commentThreadIds: string[] = [];

  for (const [node] of textNodes) {
    const newIds = Object.keys(node)
      .filter((k) => k.startsWith('commentThreadId_'))
      .map((k) => k.replace('commentThreadId_', ''))
      .filter((id) => !commentThreadIds.includes(id));
    commentThreadIds.push(...newIds);
  }

  return commentThreadIds;
};
