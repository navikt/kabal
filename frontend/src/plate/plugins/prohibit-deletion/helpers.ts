import { ELEMENT_LABEL_CONTENT, ELEMENT_REGELVERK, UNCHANGEABLE, UNDELETABLE } from '@app/plate/plugins/element-types';
import { ElementApi, NodeApi, type NodeEntry, type NodeOf } from '@udecode/plate';
import type { PlateEditor } from '@udecode/plate-core/react';

export const isInUnchangeableElement = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  return editor.api.some({ match: (n) => ElementApi.isElement(n) && UNCHANGEABLE.includes(n.type), voids: true });
};

export const isUndeletable = (editor: PlateEditor, nodeEntry: NodeEntry<NodeOf<PlateEditor>> | undefined): boolean => {
  if (nodeEntry === undefined) {
    return false;
  }

  const nodeIsUndeletable = ElementApi.isElement(nodeEntry[0]) && UNDELETABLE.includes(nodeEntry[0].type);

  if (nodeIsUndeletable) {
    return true;
  }

  if (hasUndeletableAncestor(editor, nodeEntry)) {
    return true;
  }

  const parenNodeEntry = editor.api.parent(nodeEntry[1]);
  const containsLabelContent =
    parenNodeEntry !== undefined && editor.api.some({ match: { type: ELEMENT_LABEL_CONTENT, at: parenNodeEntry[1] } });

  return containsLabelContent;
};

const hasUndeletableAncestor = (editor: PlateEditor, descendantEntry: NodeEntry<NodeOf<PlateEditor>>): boolean => {
  const ancestorEntries = NodeApi.ancestors(editor, descendantEntry[1]);

  if (ancestorEntries === undefined) {
    return false;
  }

  for (const [node] of ancestorEntries) {
    if (ElementApi.isElement(node) && UNDELETABLE.includes(node.type)) {
      return true;
    }
  }

  return false;
};

export const isInRegelverk = (editor: PlateEditor): boolean => editor.api.some({ match: { type: ELEMENT_REGELVERK } });
