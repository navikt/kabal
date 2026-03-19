import { NodeApi } from 'platejs';
import type { PlateEditor } from 'platejs/react';
import type { Path } from 'slate';
import { ELEMENT_MALTEKST, ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import type { PlaceholderElement } from '@/plate/types';

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
