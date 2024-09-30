import { UNDELETABLE_BUT_REDIGERBAR } from '@app/plate/plugins/element-types';
import type { EditorDescendant } from '@app/plate/types';
import { isInList } from '@app/plate/utils/queries';
import { type NodeOf, findNode, isElement, isEndPoint, isStartPoint } from '@udecode/plate-common';
import type { PlateEditor } from '@udecode/plate-core/react';

const match = (n: NodeOf<EditorDescendant>) => isElement(n) && UNDELETABLE_BUT_REDIGERBAR.includes(n.type);

export const handleDeleteBackwardInUndeletable = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const redigerbarMaltekst = findNode(editor, { match });

  // Normal handling if not redigerbar maltekst / regelverk
  if (redigerbarMaltekst === undefined) {
    return false;
  }

  const [, path] = redigerbarMaltekst;

  // Normal handling if focus is not at the start of redigerbar maltekst / regelverk
  if (!isStartPoint(editor, editor.selection.anchor, path)) {
    return false;
  }

  // Normal handling for lists (will be converted to paragraph)
  if (isInList(editor)) {
    return false;
  }

  return true;
};

export const handleDeleteForwardInUndeletable = (editor: PlateEditor): boolean => {
  if (editor.selection === null) {
    return false;
  }

  const redigerbarMaltekst = findNode(editor, { match });

  // Normal handling if not redigerbar maltekst / regelverk
  if (redigerbarMaltekst === undefined) {
    return false;
  }

  const [, path] = redigerbarMaltekst;

  // Normal handling if focus is not at the end of redigerbar maltekst / regelverk
  if (!isEndPoint(editor, editor.selection.anchor, path)) {
    return false;
  }

  return true;
};
