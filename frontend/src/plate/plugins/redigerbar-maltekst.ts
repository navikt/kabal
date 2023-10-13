import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_REDIGERBAR_MALTEKST } from './element-types';

export const createRedigerbarMaltekstPlugin = createPluginFactory({
  key: ELEMENT_REDIGERBAR_MALTEKST,
  isElement: true,
  isVoid: false,
});
