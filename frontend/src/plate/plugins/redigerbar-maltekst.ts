import { createPlatePlugin } from 'platejs/react';
import { RedigerbarMaltekst } from '@/plate/components/redigerbar-maltekst';
import { ELEMENT_REDIGERBAR_MALTEKST } from '@/plate/plugins/element-types';

export const RedigerbarMaltekstPlugin = createPlatePlugin({
  key: ELEMENT_REDIGERBAR_MALTEKST,
  node: {
    isElement: true,
    isVoid: false,
    component: RedigerbarMaltekst,
  },
});
