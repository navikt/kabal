import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';

export const createMaltekstPlugin = createPluginFactory({
  key: ELEMENT_MALTEKST,
  isElement: true,
  isVoid: false,
});
