import { CurrentDate } from '@app/plate/components/current-date';
import { ELEMENT_CURRENT_DATE } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from '@platejs/core/react';

export const CurrentDatePlugin = createPlatePlugin({
  key: ELEMENT_CURRENT_DATE,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: CurrentDate,
  },
});
