import { createPluginFactory } from '@udecode/plate';

export const ELEMENT_REDIGERBAR_MALTEKST = 'redigerbar-maltekst';

export const createRedigerbarMaltekstPlugin = createPluginFactory({
  key: ELEMENT_REDIGERBAR_MALTEKST,
  isElement: true,
  isVoid: false,
});
