import { findNode, getNodeAncestors } from '@udecode/plate-common';
import { Path } from 'slate';
import { PlaceholderElement, RichTextEditor } from '../../types';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '../element-types';

export const getPlaceholderEntry = (editor: RichTextEditor) =>
  findNode<PlaceholderElement>(editor, { match: { type: ELEMENT_PLACEHOLDER } });

export const isPlaceholderInMaltekst = (editor: RichTextEditor, placeholderPath: Path) => {
  const ancestors = getNodeAncestors(editor, placeholderPath);

  for (const ancestor of ancestors) {
    if (ancestor[0].type === ELEMENT_MALTEKST) {
      return true;
    }
  }

  return false;
};
