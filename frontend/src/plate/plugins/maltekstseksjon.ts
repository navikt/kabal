import { createPlatePlugin } from 'platejs/react';
import { Maltekstseksjon } from '@/plate/components/maltekstseksjon/maltekstseksjon';
import { ELEMENT_MALTEKSTSEKSJON } from '@/plate/plugins/element-types';

export const MaltekstseksjonPlugin = createPlatePlugin({
  key: ELEMENT_MALTEKSTSEKSJON,
  node: {
    isElement: true,
    isVoid: false,
    component: Maltekstseksjon,
  },
});
