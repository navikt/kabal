import { createPluginFactory } from '@udecode/plate';
import { ELEMENT_REGELVERK } from './element-types';

export const createRegelverkPlugin = createPluginFactory({
  key: ELEMENT_REGELVERK,
  isElement: true,
  isVoid: false,
  isInline: false,
});
