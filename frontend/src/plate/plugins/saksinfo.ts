import { createPlatePlugin } from 'platejs/react';
import { Saksinfo } from '@/plate/components/saksinfo';
import { ELEMENT_SAKSINFO } from '@/plate/plugins/element-types';

export const SaksinfoPlugin = createPlatePlugin({
  key: ELEMENT_SAKSINFO,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Saksinfo,
  },
});
