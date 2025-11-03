import { ELEMENT_PLACEHOLDER, UNCHANGEABLE } from '@app/plate/plugins/element-types';
import { NodeApi, type Path } from 'platejs';
import type { PlateEditor } from 'platejs/react';

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
    if (NodeApi.isEditor(ancestor) || ancestor.type === ELEMENT_PLACEHOLDER) {
      return true;
    }

    if (UNCHANGEABLE.includes(ancestor.type)) {
      return false;
    }
  }

  return false;
};
