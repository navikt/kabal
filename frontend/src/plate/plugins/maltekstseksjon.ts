import { Maltekstseksjon } from '@app/plate/components/maltekstseksjon/maltekstseksjon';
import { ELEMENT_MALTEKSTSEKSJON } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from '@platejs/core/react';

export const MaltekstseksjonPlugin = createPlatePlugin({
  key: ELEMENT_MALTEKSTSEKSJON,
  node: {
    isElement: true,
    isVoid: false,
    component: Maltekstseksjon,
  },
});
