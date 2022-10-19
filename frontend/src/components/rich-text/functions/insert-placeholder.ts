import { Editor, Node, Path, Range, Text, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ContentTypeEnum, UndeletableContentEnum } from '../types/editor-enums';
import { isOfElementTypeFn } from '../types/editor-type-guards';
import { MaltekstElementType, PlaceholderElementType } from '../types/editor-types';

export const removePlaceholder = (editor: Editor) => {
  const { selection } = editor;

  if (selection === null) {
    return;
  }

  const [node] = Editor.nodes(editor, {
    at: selection,
    match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
  });

  if (node === undefined) {
    return;
  }
  const [n] = node;
  const p = n.placeholder;

  const hadText = Node.string(n).length !== 0;

  Editor.withoutNormalizing(editor, () => {
    Transforms.liftNodes(editor, { at: selection, match: Text.isText });

    if (!hadText) {
      Transforms.insertText(editor, p);
    }
  });
};

export const insertPlaceholder = (editor: Editor, placeholder: string) => {
  const { selection } = editor;

  if (selection === null) {
    return;
  }

  if (isPlaceholderActive(editor) && Range.isCollapsed(selection)) {
    removePlaceholder(editor);
  }

  const [match] = Editor.nodes(editor, {
    match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
  });

  if (match !== undefined) {
    Transforms.select(editor, match[1]);

    return;
  }

  const node: PlaceholderElementType = {
    type: ContentTypeEnum.PLACEHOLDER,
    placeholder,
    content: '',
    children: [{ text: '' }],
  };

  Editor.withoutNormalizing(editor, () => {
    Transforms.insertNodes(editor, [node, { text: '' }], { select: true });
    ReactEditor.focus(editor);
  });
};

export const isPlaceholderActive = (editor: Editor) => {
  const [placeholder] = Editor.nodes(editor, {
    match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
  });

  return typeof placeholder !== 'undefined';
};

export const insertPlaceholderFromSelection = (editor: Editor) => {
  const { selection } = editor;

  if (selection === null || Range.isCollapsed(selection)) {
    return;
  }

  if (isPlaceholderActive(editor)) {
    return;
  }

  const textFromSelection = Editor.string(editor, selection);

  Editor.withoutNormalizing(editor, () => {
    const placeholder: PlaceholderElementType = {
      type: ContentTypeEnum.PLACEHOLDER,
      placeholder: textFromSelection,
      content: '',
      children: [{ text: '' }],
    };
    Transforms.delete(editor);
    Transforms.insertNodes(editor, [placeholder, { text: '' }], {
      at: Range.start(selection),
      match: Text.isText,
      select: true,
    });
  });
};

export const isPlaceholderSelectedInMaltekstWithOverlap = (editor: Editor): boolean => {
  if (!isPlaceholderActive(editor) || editor.selection === null) {
    return false;
  }

  const [maltekst] = Editor.nodes(editor, {
    match: isOfElementTypeFn<MaltekstElementType>(UndeletableContentEnum.MALTEKST),
  });

  if (typeof maltekst === 'undefined') {
    return false;
  }

  const [placeholder] = Editor.nodes(editor, {
    match: isOfElementTypeFn<PlaceholderElementType>(ContentTypeEnum.PLACEHOLDER),
  });

  if (typeof placeholder === 'undefined') {
    return false;
  }

  const [, placeholderPath] = placeholder;

  const { anchor, focus } = editor.selection;

  if (
    Path.isBefore(anchor.path, placeholderPath) ||
    Path.isAfter(focus.path, placeholderPath) ||
    Path.isAfter(anchor.path, placeholderPath) ||
    Path.isBefore(focus.path, placeholderPath)
  ) {
    return true;
  }

  return false;
};
