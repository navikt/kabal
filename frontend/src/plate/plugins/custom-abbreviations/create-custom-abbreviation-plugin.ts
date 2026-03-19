import { createPlatePlugin } from 'platejs/react';
import { onKeyDown } from '@/plate/plugins/custom-abbreviations/on-key-down';

const KEY_CUSTOM_ABBREVIATIONS = 'custom-abbreviations';

export const CustomAbbreviationPlugin = createPlatePlugin({
  key: KEY_CUSTOM_ABBREVIATIONS,
  handlers: {
    onKeyDown: ({ editor, event }) => onKeyDown(editor, event),
  },
});
