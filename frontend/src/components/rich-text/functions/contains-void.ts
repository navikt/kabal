import { Editor, Element, Location } from 'slate';
import { DeletableVoidElementsEnum } from '../types/editor-enums';

export const containsVoid = (editor: Editor, at: Location | null | undefined) => {
  if (at === null || typeof at === 'undefined') {
    return true;
  }

  const [nodeEntry] = Editor.nodes(editor, {
    at,
    voids: true,
    match: (n) => Element.isElement(n) && Editor.isVoid(editor, n),
  });

  return typeof nodeEntry !== 'undefined';
};

const deletableVoidType = Object.values(DeletableVoidElementsEnum);

export const containsUndeletableVoid = (editor: Editor, at: Location | null | undefined) => {
  if (at === null || typeof at === 'undefined') {
    return true;
  }

  const [nodeEntry] = Editor.nodes(editor, {
    at,
    voids: true,
    match: (n) => Element.isElement(n) && Editor.isVoid(editor, n) && !deletableVoidType.some((t) => t === n.type),
  });

  return typeof nodeEntry !== 'undefined';
};
