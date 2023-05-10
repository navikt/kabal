import { createPluginFactory } from '@udecode/plate';

export const ELEMENT_CURRENT_DATE = 'current-date';

export const createCurrentDatePlugin = createPluginFactory({
  key: ELEMENT_CURRENT_DATE,
  isElement: true,
  isVoid: true,
  isInline: false,
});
