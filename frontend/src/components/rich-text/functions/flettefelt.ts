import { Editor, Path } from 'slate';
import { DeletableVoidElementsEnum } from '../types/editor-enums';
import { isOfElementTypesFn } from '../types/editor-type-guards';
import { FlettefeltElementType } from '../types/editor-void-types';

export const getFlettefeltPath = (editor: Editor): Path | null => {
  const [flettefeltEntry] = Editor.nodes<FlettefeltElementType>(editor, {
    match: isOfElementTypesFn([DeletableVoidElementsEnum.FLETTEFELT]),
    voids: true,
  });

  if (flettefeltEntry === undefined) {
    return null;
  }

  const [, flettefeltPath] = flettefeltEntry;

  return flettefeltPath;
};
