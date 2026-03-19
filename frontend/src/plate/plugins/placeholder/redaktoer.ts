import { createPlatePlugin } from 'platejs/react';
import { isMetaKey } from '@/keys';
import { RedaktørPlaceholder } from '@/plate/components/placeholder/placeholder';
import { ELEMENT_PLACEHOLDER } from '@/plate/plugins/element-types';
import { handleNavigation } from '@/plate/plugins/placeholder/handle-navigation';
import { parsers } from '@/plate/plugins/placeholder/html-parsers';
import { handleSelectAll } from '@/plate/plugins/placeholder/select-all';
import { withOverrides } from '@/plate/plugins/placeholder/with-overrides';
import { isPlaceholderActive } from '@/plate/utils/queries';
import { insertPlaceholderFromSelection, removePlaceholder } from '@/plate/utils/transforms';

export const RedaktoerPlaceholderPlugin = createPlatePlugin({
  key: ELEMENT_PLACEHOLDER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: true,
    component: RedaktørPlaceholder,
  },
  rules: { selection: { affinity: 'directional' } }, // Makes it possible to place the caret at the edges of the placeholder in Chrome.
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (handleSelectAll(editor, event)) {
        return;
      }

      if (handleNavigation(editor, event)) {
        return true; // Prevent further handling
      }

      if (isMetaKey(event) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        event.stopPropagation();

        if (isPlaceholderActive(editor)) {
          removePlaceholder(editor);
        } else {
          insertPlaceholderFromSelection(editor, editor.selection);
        }
      }
    },
  },
  parsers,
}).overrideEditor(withOverrides);
