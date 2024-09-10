import { type PlateEditor, findNode, getNodeAncestors } from '@udecode/plate-common';
import type { Path } from 'slate';
import type { PlaceholderElement } from '../../types';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '../element-types';

export const getPlaceholderEntry = (editor: PlateEditor) =>
  findNode<PlaceholderElement>(editor, { match: { type: ELEMENT_PLACEHOLDER } });

export const isPlaceholderInMaltekst = (editor: PlateEditor, placeholderPath: Path) => {
  const ancestors = getNodeAncestors(editor, placeholderPath);

  for (const ancestor of ancestors) {
    if (ancestor[0].type === ELEMENT_MALTEKST) {
      return true;
    }
  }

  return false;
};
