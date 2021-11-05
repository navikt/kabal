import { Editor, Range, Text } from 'slate';
import { IMarks, isNodeMarkableElementType } from '../../editor-types';
import { pruneSelection } from './pruneSelection';

export const isMarkActive = (editor: Editor, mark: keyof IMarks): boolean => {
  if (editor.selection === null || Range.isCollapsed(editor.selection)) {
    const editorMarkStatus = getEditorMarkStatus(editor, mark);

    if (typeof editorMarkStatus === 'boolean') {
      return editorMarkStatus;
    }
  }

  const [match] = Editor.nodes(editor, {
    mode: 'lowest',
    reverse: true,
    universal: true,
    at: pruneSelection(editor) ?? undefined,
    match: (n) => Text.isText(n) && n[mark] === true,
  });
  return Boolean(match);
};

const getEditorMarkStatus = (editor: Editor, mark: keyof IMarks) => {
  const marks = Editor.marks(editor);
  return marks ? marks[mark] === true : false;
};

export const isMarkingAvailable = (editor: Editor) => {
  const [match] = Editor.nodes(editor, {
    mode: 'all',
    universal: true,
    at: pruneSelection(editor) ?? undefined,
    match: isNodeMarkableElementType,
  });
  return Boolean(match);
};

export const toggleMark = (editor: Editor, mark: keyof IMarks): void => {
  if (mark === 'subscript') {
    Editor.addMark(editor, 'superscript', false);
  }

  if (mark === 'superscript') {
    Editor.addMark(editor, 'subscript', false);
  }

  Editor.addMark(editor, mark, !isMarkActive(editor, mark));
};
