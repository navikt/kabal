import { createPlatePlugin } from 'platejs/react';
import { Saksnummer } from '@/plate/components/saksnummer';
import { ELEMENT_SAKSNUMMER } from '@/plate/plugins/element-types';

export const SaksnummerPlugin = createPlatePlugin({
  key: ELEMENT_SAKSNUMMER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Saksnummer,
  },
});
