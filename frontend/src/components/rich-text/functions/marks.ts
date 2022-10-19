import { Editor, Range, Text, Transforms } from 'slate';
import { DeletableVoidElementsEnum } from '../types/editor-enums';
import { isNodeMarkableElementType, isOfElementTypeFn } from '../types/editor-type-guards';
import { FlettefeltElementType } from '../types/editor-void-types';
import { IMarks, MarkKeys } from '../types/marks';
import { pruneSelection } from './prune-selection';

export const isMarkActive = (editor: Editor, mark: keyof IMarks): boolean => {
  if (editor.selection === null || Range.isCollapsed(editor.selection)) {
    return getEditorMarkStatus(editor, mark);
  }

  const matchGenerator = Editor.nodes<Text>(editor, {
    mode: 'lowest',
    reverse: true,
    universal: true,
    at: pruneSelection(editor) ?? undefined,
    match: Text.isText,
  });

  for (const [node] of matchGenerator) {
    if (node[mark] === true) {
      return true;
    }
  }

  const flettefeltGenerator = Editor.nodes<FlettefeltElementType>(editor, {
    match: isOfElementTypeFn(DeletableVoidElementsEnum.FLETTEFELT),
    voids: true,
  });

  for (const [node] of flettefeltGenerator) {
    if (node[mark] === true) {
      return true;
    }
  }

  return false;
};

const getEditorMarkStatus = (editor: Editor, mark: keyof IMarks) => {
  const marks = Editor.marks(editor);

  if (marks !== null) {
    if (marks[mark] === true) {
      return true;
    }
  }

  const flettefeltGenerator = Editor.nodes(editor, {
    match: isOfElementTypeFn(DeletableVoidElementsEnum.FLETTEFELT),
    voids: true,
  });

  for (const [node] of flettefeltGenerator) {
    if (node[mark] === true) {
      return true;
    }
  }

  return false;
};

export const isMarkingAvailable = (editor: Editor) => {
  const [flettefeltMatch] = Editor.nodes(editor, {
    match: isOfElementTypeFn(DeletableVoidElementsEnum.FLETTEFELT),
    voids: true,
  });

  if (flettefeltMatch !== undefined) {
    return true;
  }

  const at = pruneSelection(editor) ?? undefined;

  const [match] = Editor.nodes(editor, {
    mode: 'all',
    universal: true,
    voids: false,
    at,
    match: isNodeMarkableElementType,
  });

  return match !== undefined;
};

export const toggleMark = (editor: Editor, mark: keyof IMarks): void => {
  if (mark === MarkKeys.subscript) {
    Editor.addMark(editor, MarkKeys.superscript, false);
  }

  if (mark === MarkKeys.superscript) {
    Editor.addMark(editor, MarkKeys.subscript, false);
  }

  const value = !isMarkActive(editor, mark);

  Editor.addMark(editor, mark, value);

  Transforms.setNodes(editor, { [mark]: value }, { match: isOfElementTypeFn(DeletableVoidElementsEnum.FLETTEFELT) });

  if (editor.selection === null || Range.isCollapsed(editor.selection)) {
    return;
  }

  Transforms.setNodes(
    editor,
    { [mark]: value },
    { match: Text.isText, mode: 'lowest', split: true, at: editor.selection }
  );
};
