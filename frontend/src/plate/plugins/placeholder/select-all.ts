import type { PlateEditor } from 'platejs/react';
import type { KeyboardEvent } from 'react';
import { isMetaKey, Keys } from '@/keys';
import { ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';

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
