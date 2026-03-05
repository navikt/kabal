import { Saksnummer } from '@app/plate/components/saksnummer';
import { ELEMENT_SAKSNUMMER } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from 'platejs/react';

export const SaksnummerPlugin = createPlatePlugin({
  key: ELEMENT_SAKSNUMMER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Saksnummer,
  },
});
