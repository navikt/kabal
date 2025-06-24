import { onKeyDown } from '@app/plate/plugins/custom-abbreviations/on-key-down';
import { createPlatePlugin } from '@platejs/core/react';

const KEY_CUSTOM_ABBREVIATIONS = 'custom-abbreviations';

export const CustomAbbreviationPlugin = createPlatePlugin({
  key: KEY_CUSTOM_ABBREVIATIONS,
  handlers: {
    onKeyDown: ({ editor, event }) => onKeyDown(editor, event),
  },
});
