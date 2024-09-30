import { Maltekst } from '@app/plate/components/maltekst/maltekst';
import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from '@udecode/plate-core/react';

export const MaltekstPlugin = createPlatePlugin({
  key: ELEMENT_MALTEKST,
  node: {
    isElement: true,
    isVoid: false,
    component: Maltekst,
  },
});
