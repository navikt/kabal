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
  type Descendant,
  ElementApi,
  NodeApi,
  RangeApi,
  type TElement,
  type TNode,
  type TText,
  TextApi,
} from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseNumberedListPlugin } from '@udecode/plate-list';
import { BaseTablePlugin } from '@udecode/plate-table';

// Ensures a next-path even though original path is at end
export const nextPath = (path: number[]) => {
  const last = path.at(-1);

  return [...path.slice(0, -1), typeof last === 'number' ? last + 1 : 0];
};

const isChildEmpty = (child: ParentOrChildElement | TElement | TText | FormattedText): boolean => {
  if (TextApi.isText(child)) {
    return child.text.length === 0;
  }

  return child.children.every((c) => isChildEmpty(c));
};

export const isNodeEmpty = (node: Descendant) => {
  if (TextApi.isText(node)) {
    return node.text.length === 0;
  }

  return node.children.every((child) => isChildEmpty(child));
};

// TODO: Only allow known keys in args
export const isOfElementType = <T extends RichTextEditorElement>(node: TNode, type: string): node is T =>
  ElementApi.isElement(node) && node.type === type;

export const isOfElementTypeFn =
  <T extends RichTextEditorElement>(type: string) =>
  (node: TNode): node is T =>
    ElementApi.isElement(node) && type === node.type;

export const isOfElementTypesFn =
  <T extends RichTextEditorElement>(types: string[]) =>
  (node: TNode): node is T =>
    'type' in node && typeof node.type === 'string' && types.includes(node.type);

const LIST_MATCHER = isOfElementTypesFn<BulletListElement | NumberedListElement>([
  BaseBulletedListPlugin.key,
  BaseNumberedListPlugin.key,
]);
export const isInList = (editor: PlateEditor): boolean => editor.api.some({ match: LIST_MATCHER });

export const isInTable = (editor: PlateEditor): boolean => editor.api.some({ match: { type: BaseTablePlugin.key } });

const HEADINGS_MATCHER = isOfElementTypesFn<H1Element | H2Element | H3Element>([
  HEADING_KEYS.h1,
  HEADING_KEYS.h2,
  HEADING_KEYS.h3,
]);
export const isInHeading = (editor: RichTextEditor): boolean => editor.api.some({ match: HEADINGS_MATCHER });

const isContained = (editor: PlateEditor, type: string) => {
  if (editor.selection === null) {
    return false;
  }

  const match = { type };
  const anchorPlaceholderEntry = editor.api.node({ match, at: editor.selection.anchor });

  if (RangeApi.isCollapsed(editor.selection)) {
    return anchorPlaceholderEntry !== undefined;
  }

  const focusPlaceholderEntry = editor.api.node({ match, at: editor.selection.focus });

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
  editor.api.some({ match: { type: SaksbehandlerPlaceholderPlugin.key } });

export const getIsInRegelverk = (editor: PlateEditor, element: TNode): boolean => {
  const path = editor.api.findPath(element);

  if (path === undefined) {
    return false;
  }

  const ancestors = NodeApi.ancestors(editor, path);

  for (const ancestor of ancestors) {
    if (isOfElementType(ancestor[0], RegelverkPlugin.key)) {
      return true;
    }
  }

  return false;
};
