import { createPlatePlugin } from 'platejs/react';
import { Fullmektig } from '@/plate/components/fullmektig';
import { ELEMENT_FULLMEKTIG } from '@/plate/plugins/element-types';

export const FullmektigPlugin = createPlatePlugin({
  key: ELEMENT_FULLMEKTIG,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Fullmektig,
  },
});
