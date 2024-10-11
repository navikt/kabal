import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import { createPluginFactory } from '@udecode/plate-common';

export const createMaltekstPlugin = createPluginFactory({
  key: ELEMENT_MALTEKST,
  isElement: true,
  isVoid: false,
});
