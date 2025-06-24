import type { PlateEditor } from '@platejs/core/react';
import { NodeApi } from 'platejs';
import type { Path } from 'slate';
import type { PlaceholderElement } from '../../types';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '../element-types';

export const getPlaceholderEntry = (editor: PlateEditor) =>
  editor.api.node<PlaceholderElement>({ match: { type: ELEMENT_PLACEHOLDER } });

export const isPlaceholderInMaltekst = (editor: PlateEditor, placeholderPath: Path) => {
  const ancestors = NodeApi.ancestors(editor, placeholderPath);

  for (const ancestor of ancestors) {
    if (ancestor[0].type === ELEMENT_MALTEKST) {
      return true;
    }
  }

  return false;
};
