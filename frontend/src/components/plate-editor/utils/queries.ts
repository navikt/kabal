import { TDescendant, TElement, TText, isElement, isText } from '@udecode/plate';
import { PlateEditor } from '@udecode/plate-core';
import { ELEMENT_REDIGERBAR_MALTEKST } from '@app/components/plate-editor/plugins/element-types';
import {
  ChildElement,
  EditorDescendant,
  EditorValue,
  ParentOrChildElement,
  RedigerbarMaltekstElement,
  RichText,
} from '@app/components/plate-editor/types';

// Ensures a next-path even though original path is at end
export const nextPath = (path: number[]) => {
  const last = path[path.length - 1];

  return [...path.slice(0, -1), typeof last === 'number' ? last + 1 : 0];
};

const nodeIsRedigerbarMaltekst = (node: EditorDescendant): node is RedigerbarMaltekstElement =>
  isElement(node) && node.type === ELEMENT_REDIGERBAR_MALTEKST;

const isChildEmpty = (
  editor: PlateEditor<EditorValue>,
  child: ParentOrChildElement | TElement | TText | RichText
): boolean => {
  if (isText(child)) {
    return child.text.length === 0;
  }

  return child.children.every((c) => isChildEmpty(editor, c));
};

export const isNodeEmpty = (editor: PlateEditor<EditorValue>, node: EditorDescendant) => {
  if (!nodeIsRedigerbarMaltekst(node)) {
    return false;
  }

  if (node.children.length === 0) {
    return true;
  }

  return node.children.every((child) => isChildEmpty(editor, child));
};
