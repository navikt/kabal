import { HeaderFooter } from '@app/plate/components/header-footer';
import { ELEMENT_FOOTER, ELEMENT_HEADER } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from '@udecode/plate-core/react';

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
