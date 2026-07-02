import { createPlatePlugin } from 'platejs/react';
import { ArenaSaksnummer, Saksnummer } from '@/plate/components/saksnummer';
import { ELEMENT_ARENA_SAKSNUMMER, ELEMENT_SAKSNUMMER } from '@/plate/plugins/element-types';

export const SaksnummerPlugin = createPlatePlugin({
  key: ELEMENT_SAKSNUMMER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: Saksnummer,
  },
});

export const ArenaSaksnummerPlugin = createPlatePlugin({
  key: ELEMENT_ARENA_SAKSNUMMER,
  node: {
    isElement: true,
    isVoid: false,
    isInline: false,
    component: ArenaSaksnummer,
  },
});
