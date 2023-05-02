import { createPluginFactory } from '@udecode/plate';

export const ELEMENT_PLACEHOLDER = 'placeholder';

export const createPlaceholderPlugin = createPluginFactory({
  key: ELEMENT_PLACEHOLDER,
  isElement: true,
  isVoid: false,
  isInline: true,
});
