import { EmptyVoid } from '@app/plate/components/empty-void';
import { ELEMENT_EMPTY_VOID } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from '@udecode/plate-core/react';

export const EmptyVoidPlugin = createPlatePlugin({
  key: ELEMENT_EMPTY_VOID,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: EmptyVoid,
  },
});
