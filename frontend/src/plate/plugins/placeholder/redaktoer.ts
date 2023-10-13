import { createPluginFactory } from '@udecode/plate-common';
import { handleArrows } from '@app/plate/plugins/placeholder/arrows';
import { handleSelectAll } from '@app/plate/plugins/placeholder/select-all';
import { isPlaceholderActive } from '@app/plate/utils/queries';
import { insertPlaceholderFromSelection, removePlaceholder } from '@app/plate/utils/transforms';
import { ELEMENT_PLACEHOLDER } from '../element-types';
import { withOverrides } from './with-overrides';

export const createRedaktoerPlaceholderPlugin = createPluginFactory({
  key: ELEMENT_PLACEHOLDER,
  isElement: true,
  isVoid: false,
  isInline: true,
  withOverrides,
  handlers: {
    onKeyDown: (editor) => (e) => {
      if (handleSelectAll(editor, e) || handleArrows(editor, e)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        e.stopPropagation();

        if (isPlaceholderActive(editor)) {
          removePlaceholder(editor);
        } else {
          insertPlaceholderFromSelection(editor);
        }
      }
    },
  },
});
