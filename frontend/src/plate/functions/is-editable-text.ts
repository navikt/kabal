import { NodeApi, type Path } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import { ELEMENT_PLACEHOLDER, ELEMENT_REGELVERK_CONTAINER, UNCHANGEABLE } from '@/plate/plugins/element-types';

export const isEditableTextNode = (editor: PlateEditor, path: Path): boolean => {
  const parent = editor.api.parent(path);

  if (parent === undefined) {
    return false;
  }

  const [parentNode] = parent;

  if (parentNode.type === ELEMENT_PLACEHOLDER) {
    return true;
  }

  const ancestors = NodeApi.ancestors(editor, path, { reverse: true });

  for (const [ancestor] of ancestors) {
    if (
      NodeApi.isEditor(ancestor) ||
      ancestor.type === ELEMENT_PLACEHOLDER ||
      ancestor.type === ELEMENT_REGELVERK_CONTAINER
    ) {
      return true;
    }

    if (UNCHANGEABLE.includes(ancestor.type)) {
      return false;
    }
  }

  return false;
};
