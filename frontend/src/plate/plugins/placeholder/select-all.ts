import { isMetaKey, Keys } from '@app/keys';
import { ELEMENT_PLACEHOLDER } from '@app/plate/plugins/element-types';
import type { PlateEditor } from 'platejs/react';
import type { KeyboardEvent } from 'react';

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
