import { Editor, Node, NodeEntry, Selection, Text } from 'slate';
import { ReactEditor } from 'slate-react';

const COMMENT_PREFIX = 'commentThreadId_';

export const getFocusedCommentThreadIds = (editor: Editor | null, selection: Selection): string[] => {
  if (editor === null) {
    return [];
  }

  if (selection !== null && !ReactEditor.hasRange(editor, selection)) {
    return [];
  }

  const selectedCommentedNodes = getCommentedNodes(editor, selection);

  if (selectedCommentedNodes.length === 0) {
    const at: Selection = {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    };

    const allCommentedNodes = getCommentedNodes(editor, at);
    return getCommentThreadIds(allCommentedNodes);
  }

  return getCommentThreadIds(selectedCommentedNodes);
};

const getCommentedNodes = (editor: Editor, selection: Selection) => {
  if (selection === null) {
    return [];
  }

  return Array.from(
    Editor.nodes(editor, {
      match: (n) => Text.isText(n) && Object.keys(n).some((key) => key.startsWith(COMMENT_PREFIX)),
      reverse: true,
      mode: 'lowest',
      at: selection,
    })
  );
};

const getCommentThreadIds = (commentNodes: NodeEntry<Node>[]) => {
  const commentThreadIds: string[] = [];

  for (const [node] of commentNodes) {
    const newIds = Object.keys(node)
      .filter((k) => k.startsWith(COMMENT_PREFIX))
      .map((k) => k.replace(COMMENT_PREFIX, ''))
      .filter((id) => !commentThreadIds.includes(id));
    commentThreadIds.push(...newIds);
  }

  return commentThreadIds;
};
