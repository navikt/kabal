import { Signature } from '@app/plate/components/signature/signature';
import { createPlatePlugin } from '@platejs/core/react';
import { ELEMENT_SIGNATURE } from './element-types';

export const SignaturePlugin = createPlatePlugin({
  key: ELEMENT_SIGNATURE,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: Signature,
  },
});
