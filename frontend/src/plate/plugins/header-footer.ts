import { createPlatePlugin } from 'platejs/react';
import { HeaderFooter } from '@/plate/components/header-footer';
import { ELEMENT_FOOTER, ELEMENT_HEADER } from '@/plate/plugins/element-types';

export const HeaderPlugin = createPlatePlugin({
  key: ELEMENT_HEADER,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: HeaderFooter,
  },
});

export const FooterPlugin = createPlatePlugin({
  key: ELEMENT_FOOTER,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: HeaderFooter,
  },
});
