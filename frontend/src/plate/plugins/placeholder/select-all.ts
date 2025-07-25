import { isMetaKey, Keys } from '@app/keys';
import type { PlateEditor } from '@platejs/core/react';
import type { KeyboardEvent } from 'react';
import { ELEMENT_PLACEHOLDER } from '../element-types';

export const handleSelectAll = (editor: PlateEditor, e: KeyboardEvent) => {
  const lowerCaseKey = e.key.toLowerCase();

  if (isMetaKey(e) && lowerCaseKey === Keys.A) {
    const placeholder = editor.api.node({ match: { type: ELEMENT_PLACEHOLDER } });

    if (placeholder !== undefined) {
      e.preventDefault();
      e.stopPropagation();

      editor.tf.select(placeholder[1]);
    }

    return true;
  }

  return false;
};
