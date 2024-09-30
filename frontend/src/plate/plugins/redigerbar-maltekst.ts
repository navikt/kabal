import { RedigerbarMaltekst } from '@app/plate/components/redigerbar-maltekst';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { ELEMENT_REDIGERBAR_MALTEKST } from './element-types';

export const RedigerbarMaltekstPlugin = createPlatePlugin({
  key: ELEMENT_REDIGERBAR_MALTEKST,
  node: {
    isElement: true,
    isVoid: false,
    component: RedigerbarMaltekst,
  },
});
