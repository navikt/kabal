import {
  PlateEditor,
  TElement,
  TNode,
  TText,
  findNode,
  isCollapsed,
  isElement,
  isText,
  someNode,
} from '@udecode/plate-common';
import { ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_TABLE } from '@udecode/plate-table';
import { ELEMENT_PLACEHOLDER, ELEMENT_REGELVERK_CONTAINER } from '@app/plate/plugins/element-types';
import { isInRegelverk, isInUnchangeableElement } from '@app/plate/plugins/prohibit-deletion/helpers';
import {
  BulletListElement,
  EditorDescendant,
  EditorValue,
  NumberedListElement,
  ParentOrChildElement,
  RichText,
  RichTextEditor,
  RichTextEditorElement,
} from '@app/plate/types';

// Ensures a next-path even though original path is at end
export const nextPath = (path: number[]) => {
  const last = path[path.length - 1];

  return [...path.slice(0, -1), typeof last === 'number' ? last + 1 : 0];
};

const isChildEmpty = (
  editor: PlateEditor<EditorValue>,
  child: ParentOrChildElement | TElement | TText | RichText,
): boolean => {
  if (isText(child)) {
    return child.text.length === 0;
  }

  return child.children.every((c) => isChildEmpty(editor, c));
};

export const isNodeEmpty = (editor: PlateEditor<EditorValue>, node: EditorDescendant) => {
  if (isText(node)) {
    return node.text.length === 0;
  }

  return node.children.every((child) => isChildEmpty(editor, child));
};

// TODO: Only allow known keys in args
export const isOfElementType = <T extends RichTextEditorElement>(node: TNode, type: string): node is T =>
  isElement(node) && node.type === type;

export const isOfElementTypeFn =
  <T extends RichTextEditorElement>(type: string) =>
  (node: TNode): node is T =>
    isElement(node) && type === node.type;

export const isOfElementTypesFn =
  <T extends RichTextEditorElement>(types: string[]) =>
  (node: TNode): node is T =>
    isElement(node) && types.includes(node.type);

export const isInList = (editor: RichTextEditor): boolean =>
  someNode<BulletListElement | NumberedListElement>(editor, {
    match: (n) => isElement(n) && (n.type === ELEMENT_UL || n.type === ELEMENT_OL),
  });

export const isInTable = (editor: RichTextEditor): boolean => someNode(editor, { match: { type: ELEMENT_TABLE } });

const isContained = (editor: RichTextEditor, type: string) => {
  if (editor.selection === null) {
    return false;
  }

  const match = { type };
  const anchorPlaceholderEntry = findNode(editor, { match, at: editor.selection.anchor });

  if (isCollapsed(editor.selection)) {
    return anchorPlaceholderEntry !== undefined;
  }

  const focusPlaceholderEntry = findNode(editor, { match, at: editor.selection.focus });

  if (anchorPlaceholderEntry === undefined && focusPlaceholderEntry === undefined) {
    return false;
  }

  if (anchorPlaceholderEntry !== undefined && focusPlaceholderEntry !== undefined) {
    return anchorPlaceholderEntry[0] === focusPlaceholderEntry[0];
  }

  return false;
};

export const isUnchangeable = (editor: RichTextEditor) => {
  if (isInRegelverk(editor)) {
    return !isContained(editor, ELEMENT_REGELVERK_CONTAINER);
  }

  if (isInUnchangeableElement(editor)) {
    return !isContained(editor, ELEMENT_PLACEHOLDER);
  }

  return false;
};

export const isPlaceholderActive = (editor: RichTextEditor) =>
  someNode(editor, { match: { type: ELEMENT_PLACEHOLDER } });
