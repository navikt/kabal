import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_FOOTER, ELEMENT_HEADER } from '@app/plate/plugins/element-types';

export const createHeaderPlugin = createPluginFactory({
  key: ELEMENT_HEADER,
  isElement: true,
  isVoid: true,
  isInline: false,
});

export const createFooterPlugin = createPluginFactory({
  key: ELEMENT_FOOTER,
  isElement: true,
  isVoid: true,
  isInline: false,
});
