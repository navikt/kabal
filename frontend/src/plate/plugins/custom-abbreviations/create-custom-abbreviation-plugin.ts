import { createPluginFactory } from '@udecode/plate-common';
import { onKeyDown } from '@app/plate/plugins/custom-abbreviations/on-key-down';

const KEY_CUSTOM_ABBREVIATIONS = 'custom-abbreviations';

export const createCustomAbbreviationPlugin = createPluginFactory({
  key: KEY_CUSTOM_ABBREVIATIONS,
  handlers: {
    onKeyDown,
  },
});
