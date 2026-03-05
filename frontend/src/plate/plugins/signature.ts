import { Signature } from '@app/plate/components/signature/signature';
import { ELEMENT_SIGNATURE } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from 'platejs/react';

export const SignaturePlugin = createPlatePlugin({
  key: ELEMENT_SIGNATURE,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: Signature,
  },
});
