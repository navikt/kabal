import {
  ENode,
  TNodeEntry,
  findNode,
  getNodeAncestors,
  isElement,
  isElementEmpty,
  isEndPoint,
  isExpanded,
  isStartPoint,
  removeNodes,
  someNode,
} from '@udecode/plate-common';
import { ELEMENT_PLACEHOLDER, ELEMENT_REGELVERK, UNCHANGEABLE, UNDELETABLE } from '@app/plate/plugins/element-types';
import { EditorValue, PlaceholderElement, RichTextEditor } from '@app/plate/types';

export const isInUnchangeableElement = (editor: RichTextEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  return someNode(editor, { match: (n) => isElement(n) && UNCHANGEABLE.includes(n.type), voids: true });
};

export const isUndeletable = (
  editor: RichTextEditor,
  nodeEntry: TNodeEntry<ENode<EditorValue>> | undefined,
): boolean => {
  if (nodeEntry === undefined) {
    return false;
  }

  const nodeIsUndeletable = isElement(nodeEntry[0]) && UNDELETABLE.includes(nodeEntry[0].type);
  const ancestorIsUndeletable = hasUndeletableAncestor(editor, nodeEntry);

  return nodeIsUndeletable || ancestorIsUndeletable;
};

const hasUndeletableAncestor = (editor: RichTextEditor, descendantEntry: TNodeEntry<ENode<EditorValue>>): boolean => {
  const ancestorEntries = getNodeAncestors(editor, descendantEntry[1]);

  if (ancestorEntries === undefined) {
    return false;
  }

  for (const [node] of ancestorEntries) {
    if (isElement(node) && UNDELETABLE.includes(node.type)) {
      return true;
    }
  }

  return false;
};

export const isInRegelverk = (editor: RichTextEditor): boolean =>
  someNode(editor, { match: { type: ELEMENT_REGELVERK } });

export const handleDeleteBackwardInPlaceholder = (editor: RichTextEditor): boolean => {
  const placeholderEntry = findNode<PlaceholderElement>(editor, { match: { type: ELEMENT_PLACEHOLDER } });

  if (placeholderEntry === undefined) {
    return false;
  }

  const [node, path] = placeholderEntry;

  if (editor.selection === null || isExpanded(editor.selection)) {
    return false;
  }

  if (isStartPoint(editor, editor.selection.anchor, path)) {
    if (isElementEmpty(editor, node)) {
      removeNodes(editor, { at: path });

      return true;
    }
  }

  return false;
};

export const handleDeleteForwardInPlaceholder = (editor: RichTextEditor): boolean => {
  const placeholderEntry = findNode<PlaceholderElement>(editor, { match: { type: ELEMENT_PLACEHOLDER } });

  if (placeholderEntry === undefined) {
    return false;
  }

  const [node, path] = placeholderEntry;

  if (editor.selection === null || isExpanded(editor.selection)) {
    return false;
  }

  if (isEndPoint(editor, editor.selection.anchor, path)) {
    if (isElementEmpty(editor, node)) {
      removeNodes(editor, { at: path });

      return true;
    }
  }

  return false;
};
