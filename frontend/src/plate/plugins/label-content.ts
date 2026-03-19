import { createPlatePlugin } from 'platejs/react';
import { LabelContent } from '@/plate/components/label-content';
import { ELEMENT_LABEL_CONTENT } from '@/plate/plugins/element-types';

export const LabelContentPlugin = createPlatePlugin({
  key: ELEMENT_LABEL_CONTENT,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: LabelContent,
  },
});
