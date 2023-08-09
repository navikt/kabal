import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_CURRENT_DATE } from './element-types';

export const createCurrentDatePlugin = createPluginFactory({
  key: ELEMENT_CURRENT_DATE,
  isElement: true,
  isVoid: true,
  isInline: false,
});
