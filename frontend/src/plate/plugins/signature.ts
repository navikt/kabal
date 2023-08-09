import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_SIGNATURE } from './element-types';

export const createSignaturePlugin = createPluginFactory({
  key: ELEMENT_SIGNATURE,
  isElement: true,
  isVoid: true,
  isInline: false,
});
