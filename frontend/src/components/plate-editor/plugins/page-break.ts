import { createPluginFactory } from '@udecode/plate';
import { ELEMENT_PAGE_BREAK } from './element-types';

export const createPageBreakPlugin = createPluginFactory({
  key: ELEMENT_PAGE_BREAK,
  isElement: true,
  isVoid: true,
});
