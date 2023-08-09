import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_LABEL_CONTENT } from './element-types';

export const createLabelContentPlugin = createPluginFactory({
  key: ELEMENT_LABEL_CONTENT,
  isElement: true,
  isVoid: true,
  isInline: false,
});
