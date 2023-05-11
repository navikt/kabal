import { createPluginFactory } from '@udecode/plate';
import { ELEMENT_PLACEHOLDER } from './element-types';

export const createPlaceholderPlugin = createPluginFactory({
  key: ELEMENT_PLACEHOLDER,
  isElement: true,
  isVoid: false,
  isInline: true,
});
