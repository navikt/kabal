import { Fullmektig } from '@app/plate/components/fullmektig';
import { ELEMENT_FULLMEKTIG } from '@app/plate/plugins/element-types';
import { createPlatePlugin } from 'platejs/react';

export const FullmektigPlugin = createPlatePlugin({
  key: ELEMENT_FULLMEKTIG,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Fullmektig,
  },
});

export const FULLMEKTIG_LABEL_PLACEHOLDER = 'Fullmektigetikett';
export const FULLMEKTIG_VALUE_PLACEHOLDER = 'Fullmektig';
