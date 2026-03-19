import { createPlatePlugin } from 'platejs/react';
import { CurrentDate } from '@/plate/components/current-date';
import { ELEMENT_CURRENT_DATE } from '@/plate/plugins/element-types';

export const CurrentDatePlugin = createPlatePlugin({
  key: ELEMENT_CURRENT_DATE,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: CurrentDate,
  },
});
