import { createPluginFactory } from '@udecode/plate';

export const ELEMENT_PAGE_BREAK = 'page-break';

export const createPageBreakPlugin = createPluginFactory({
  key: ELEMENT_PAGE_BREAK,
  isElement: true,
  isVoid: true,
});
