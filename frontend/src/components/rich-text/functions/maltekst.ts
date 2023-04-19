import { Editor, Range } from 'slate';
import { pruneSelection } from '@app/components/rich-text/functions/prune-selection';
import { ContentTypeEnum, UndeletableContentEnum } from '../types/editor-enums';
import { isOfElementTypeFn } from '../types/editor-type-guards';
import { MaltekstElementType, PlaceholderElementType } from '../types/editor-types';

export const isInPlaceholderInMaltekst = (editor: Editor) => isInPlaceholder(editor) && isInMaltekst(editor);

export const isInMaltekstAndNotPlaceholder = (editor: Editor) => isInMaltekst(editor) && !isInPlaceholder(editor);

export const isInMaltekst = (editor: Editor) => {
  const at = pruneSelection(editor);

  if (at === null) {
    return false;
  }

  const [maltekstEntry] = Editor.nodes(editor, {
    at,
    match: isOfElementTypeFn<MaltekstElementType>(UndeletableContentEnum.MALTEKST),
  });

  return maltekstEntry !== undefined;
};

export const isInPlaceholder = (editor: Editor) => {
  const [placeholderEntry] = Editor.nodes(editor, {
    match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
  });

  return placeholderEntry !== undefined;
};

export const isAtEndOfPlaceholder = (editor: Editor) => {
  if (editor.selection === null || Range.isExpanded(editor.selection)) {
    return false;
  }

  const [placeholderEntry] = Editor.nodes(editor, {
    match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
  });

  if (placeholderEntry === undefined) {
    return false;
  }

  const [, path] = placeholderEntry;

  return Editor.isEnd(editor, editor.selection.focus, path);
};

export const isAtStartOfPlaceholder = (editor: Editor) => {
  if (editor.selection === null || Range.isExpanded(editor.selection)) {
    return false;
  }

  const [placeholderEntry] = Editor.nodes(editor, {
    match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
  });

  if (placeholderEntry === undefined) {
    return false;
  }

  const [, path] = placeholderEntry;

  return Editor.isStart(editor, editor.selection.anchor, path);
};
