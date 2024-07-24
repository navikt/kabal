import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_NOWRAP } from './element-types';

export const createNowrapPlugin = createPluginFactory({
  key: ELEMENT_NOWRAP,
  isElement: true,
  isVoid: false,
  isInline: true,
});
