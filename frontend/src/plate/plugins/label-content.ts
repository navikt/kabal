import { LabelContent } from '@app/plate/components/label-content';
import { ELEMENT_LABEL_CONTENT } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from 'platejs/react';

export const LabelContentPlugin = createPlatePlugin({
  key: ELEMENT_LABEL_CONTENT,
  node: {
    isElement: true,
    isVoid: true,
    isInline: false,
    component: LabelContent,
  },
});
