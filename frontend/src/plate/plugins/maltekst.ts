import { createPlatePlugin } from 'platejs/react';
import { Maltekst } from '@/plate/components/maltekst/maltekst';
import { ELEMENT_MALTEKST } from '@/plate/plugins/element-types';

export const MaltekstPlugin = createPlatePlugin({
  key: ELEMENT_MALTEKST,
  node: {
    isElement: true,
    isVoid: false,
    component: Maltekst,
  },
});
