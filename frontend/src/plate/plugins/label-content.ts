import { LabelContent } from '@app/plate/components/label-content';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { ELEMENT_LABEL_CONTENT } from './element-types';

export const LabelContentPlugin = createPlatePlugin({
  key: ELEMENT_LABEL_CONTENT,
  node: {
    isElement: true,
    isVoid: true,
    isInline: true,
    component: LabelContent,
  },
});
