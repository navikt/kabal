import { createPlatePlugin } from 'platejs/react';
import { EmptyVoid } from '@/plate/components/empty-void';
import { ELEMENT_EMPTY_VOID } from '@/plate/plugins/element-types';

export const EmptyVoidPlugin = createPlatePlugin({
  key: ELEMENT_EMPTY_VOID,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: EmptyVoid,
  },
});
