import { Saksnummer } from '@app/plate/components/saksnummer';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { ELEMENT_SAKSNUMMER } from './element-types';

export const SaksnummerPlugin = createPlatePlugin({
  key: ELEMENT_SAKSNUMMER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Saksnummer,
  },
});
