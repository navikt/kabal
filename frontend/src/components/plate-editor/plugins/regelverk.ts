import { createPluginFactory } from '@udecode/plate';

export const ELEMENT_REGELVERK = 'regelverk';
export const ELEMENT_REGELVERK_CONTAINER = 'regelverk-container';

export const createRegelverkPlugin = createPluginFactory({
  key: ELEMENT_REGELVERK,
  isElement: true,
  isVoid: false,
  isInline: false,
});
