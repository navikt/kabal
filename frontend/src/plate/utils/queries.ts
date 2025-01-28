import { SaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { isInRegelverk, isInUnchangeableElement } from '@app/plate/plugins/prohibit-deletion/helpers';
import { RegelverkContainerPlugin, RegelverkPlugin } from '@app/plate/plugins/regelverk';
import type {
  BulletListElement,
  FormattedText,
  H1Element,
  H2Element,
  H3Element,
  NumberedListElement,
  ParentOrChildElement,
  RichTextEditor,
  RichTextEditorElement,
} from '@app/plate/types';
import {
  type TDescendant,
  type TElement,
  type TNode,
  type TText,
  findNode,
  getNodeAncestors,
  isCollapsed,
  isElement,
  isText,
  someNode,
} from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-core/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTablePlugin } from '@udecode/plate-table';
import { findPath } from '@udecode/slate-react';

// Ensures a next-path even though original path is at end
export const nextPath = (path: number[]) => {
  const last = path.at(-1);

  return [...path.slice(0, -1), typeof last === 'number' ? last + 1 : 0];
};

const isChildEmpty = (child: ParentOrChildElement | TElement | TText | FormattedText): boolean => {
  if (isText(child)) {
    return child.text.length === 0;
  }

  return child.children.every((c) => isChildEmpty(c));
};

export const isNodeEmpty = (node: TDescendant) => {
  if (isText(node)) {
    return node.text.length === 0;
  }

  return node.children.every((child) => isChildEmpty(child));
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

const LIST_MATCHER = isOfElementTypesFn<BulletListElement | NumberedListElement>([
  BaseBulletedListPlugin.key,
  BaseNumberedListPlugin.key,
]);
export const isInList = (editor: PlateEditor): boolean =>
  someNode<BulletListElement | NumberedListElement>(editor, { match: LIST_MATCHER });

export const isInTable = (editor: PlateEditor): boolean => someNode(editor, { match: { type: BaseTablePlugin.key } });

const HEADINGS_MATCHER = isOfElementTypesFn<H1Element | H2Element | H3Element>([
  HEADING_KEYS.h1,
  HEADING_KEYS.h2,
  HEADING_KEYS.h3,
]);
export const isInHeading = (editor: RichTextEditor): boolean => someNode(editor, { match: HEADINGS_MATCHER });

const isContained = (editor: PlateEditor, type: string) => {
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

export const isUnchangeable = (editor: PlateEditor) => {
  if (isInRegelverk(editor)) {
    return !isContained(editor, RegelverkContainerPlugin.key);
  }

  if (isInUnchangeableElement(editor)) {
    return !isContained(editor, SaksbehandlerPlaceholderPlugin.key);
  }

  return false;
};

export const isPlaceholderActive = (editor: PlateEditor) =>
  someNode(editor, { match: { type: SaksbehandlerPlaceholderPlugin.key } });

export const getIsInRegelverk = (editor: PlateEditor, element: TNode): boolean => {
  const path = findPath(editor, element);

  if (path === undefined) {
    return false;
  }

  const ancestors = getNodeAncestors(editor, path);

  for (const ancestor of ancestors) {
    if (isOfElementType(ancestor[0], RegelverkPlugin.key)) {
      return true;
    }
  }

  return false;
};
