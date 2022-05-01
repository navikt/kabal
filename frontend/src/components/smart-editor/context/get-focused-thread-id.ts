import { Editor, Range, Selection, Text } from 'slate';
import { ReactEditor } from 'slate-react';
import { COMMENT_PREFIX } from '../constants';

export const getFocusedThreadIdFromText = (editor: Editor | null, selection: Selection): string | null => {
  if (editor === null || selection === null) {
    return null;
  }

  if (!ReactEditor.hasRange(editor, selection) || Range.isExpanded(selection)) {
    return null;
  }

  const [textEntry] = Editor.nodes(editor, { at: selection.focus, mode: 'lowest', match: Text.isText });

  if (typeof textEntry === 'undefined') {
    return null;
  }

  const [textNode] = textEntry;

  const threadIds = Object.keys(textNode)
    .filter((k) => k.startsWith(COMMENT_PREFIX))
    .map((k) => k.replace(COMMENT_PREFIX, ''));

  if (threadIds.length === 0) {
    return null;
  }

  return threadIds[0];
};
