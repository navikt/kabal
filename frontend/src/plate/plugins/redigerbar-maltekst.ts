import { RedigerbarMaltekst } from '@app/plate/components/redigerbar-maltekst';
import { ELEMENT_REDIGERBAR_MALTEKST } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from 'platejs/react';

export const RedigerbarMaltekstPlugin = createPlatePlugin({
  key: ELEMENT_REDIGERBAR_MALTEKST,
  node: {
    isElement: true,
    isVoid: false,
    component: RedigerbarMaltekst,
  },
});
