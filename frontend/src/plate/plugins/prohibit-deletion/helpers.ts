import { ELEMENT_LABEL_CONTENT, ELEMENT_REGELVERK, UNCHANGEABLE, UNDELETABLE } from '@app/plate/plugins/element-types';
import {
  type NodeOf,
  type TNodeEntry,
  getNodeAncestors,
  getParentNode,
  isElement,
  someNode,
} from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-core/react';

export const isInUnchangeableElement = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  return someNode(editor, { match: (n) => isElement(n) && UNCHANGEABLE.includes(n.type), voids: true });
};

export const isUndeletable = (editor: PlateEditor, nodeEntry: TNodeEntry<NodeOf<PlateEditor>> | undefined): boolean => {
  if (nodeEntry === undefined) {
    return false;
  }

  const nodeIsUndeletable = isElement(nodeEntry[0]) && UNDELETABLE.includes(nodeEntry[0].type);

  if (nodeIsUndeletable) {
    return true;
  }

  if (hasUndeletableAncestor(editor, nodeEntry)) {
    return true;
  }

  const parentNodeEntry = getParentNode(editor, nodeEntry[1]);
  const containsLabelContent =
    parentNodeEntry !== undefined &&
    someNode(editor, { match: { type: ELEMENT_LABEL_CONTENT, at: parentNodeEntry[1] } });

  return containsLabelContent;
};

const hasUndeletableAncestor = (editor: PlateEditor, descendantEntry: TNodeEntry<NodeOf<PlateEditor>>): boolean => {
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

export const isInRegelverk = (editor: PlateEditor): boolean => someNode(editor, { match: { type: ELEMENT_REGELVERK } });
