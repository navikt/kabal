import { createPlatePlugin } from 'platejs/react';
import { Signature } from '@/plate/components/signature/signature';
import { ELEMENT_SIGNATURE } from '@/plate/plugins/element-types';

export const SignaturePlugin = createPlatePlugin({
  key: ELEMENT_SIGNATURE,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: Signature,
  },
});
