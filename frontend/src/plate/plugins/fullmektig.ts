import { Fullmektig } from '@app/plate/components/fullmektig';
import { createPlatePlugin } from '@udecode/plate-core/react';
import { ELEMENT_FULLMEKTIG } from './element-types';

export const FullmektigPlugin = createPlatePlugin({
  key: ELEMENT_FULLMEKTIG,
  node: {
    isElement: true,
    isVoid: false,
    isInline: true,
    component: Fullmektig,
  },
});

export const FULLMEKTIG_LABEL_PLACEHOLDER = 'Fullmektigetikett';
export const FULLMEKTIG_VALUE_PLACEHOLDER = 'Fullmektig';
