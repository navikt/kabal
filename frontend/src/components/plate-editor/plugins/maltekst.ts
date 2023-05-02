import { createPluginFactory } from '@udecode/plate';

export const ELEMENT_MALTEKST = 'maltekst';

export const createMaltekstPlugin = createPluginFactory({
  key: ELEMENT_MALTEKST,
  isElement: true,
  isVoid: true,
});
