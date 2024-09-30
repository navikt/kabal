import { onKeyDown } from '@app/plate/plugins/custom-abbreviations/on-key-down';
import { createPlatePlugin } from '@udecode/plate-core/react';

const KEY_CUSTOM_ABBREVIATIONS = 'custom-abbreviations';

export const CustomAbbreviationPlugin = createPlatePlugin({
  key: KEY_CUSTOM_ABBREVIATIONS,
  handlers: {
    onKeyDown: ({ editor, event }) => onKeyDown(editor, event),
  },
});
