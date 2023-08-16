import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_EMPTY_VOID } from './element-types';

export const createEmptyVoidPlugin = createPluginFactory({
  key: ELEMENT_EMPTY_VOID,
  isElement: true,
  isVoid: true,
  isInline: false,
});
