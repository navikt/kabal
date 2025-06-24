import { LabelContent } from '@app/plate/components/label-content';
import { createPlatePlugin } from '@platejs/core/react';
import { ELEMENT_LABEL_CONTENT } from './element-types';

export const LabelContentPlugin = createPlatePlugin({
  key: ELEMENT_LABEL_CONTENT,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: LabelContent,
  },
});
