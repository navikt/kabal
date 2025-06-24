import { isMetaKey } from '@app/keys';
import { RedaktørPlaceholder } from '@app/plate/components/placeholder/placeholder';
import { handleArrows } from '@app/plate/plugins/placeholder/arrows';
import { parsers } from '@app/plate/plugins/placeholder/html-parsers';
import { handleSelectAll } from '@app/plate/plugins/placeholder/select-all';
import { isPlaceholderActive } from '@app/plate/utils/queries';
import { insertPlaceholderFromSelection, removePlaceholder } from '@app/plate/utils/transforms';
import { createPlatePlugin } from '@platejs/core/react';
import { ELEMENT_PLACEHOLDER } from '../element-types';
import { withOverrides } from './with-overrides';

export const RedaktoerPlaceholderPlugin = createPlatePlugin({
  key: ELEMENT_PLACEHOLDER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: true,
    component: RedaktørPlaceholder,
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (handleSelectAll(editor, event) || handleArrows(editor, event)) {
        return;
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
