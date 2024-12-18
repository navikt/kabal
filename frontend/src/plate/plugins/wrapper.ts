import { Wrapper } from '@app/plate/components/wrapper';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { ELEMENT_WRAPPER } from './element-types';

export const WrapperPlugin = createPlatePlugin({
  key: ELEMENT_WRAPPER,
  node: {
    isInline: false,
    isLeaf: false,
    isMarkableVoid: false,
    isElement: true,
    isVoid: false,
    component: Wrapper,
  },
  extendEditor: ({ editor }) => {
    console.log('WrapperPlugin.extendEditor');

    return editor;
  },
});
