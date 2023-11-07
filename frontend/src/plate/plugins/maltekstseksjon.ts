import { createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_MALTEKSTSEKSJON } from '@app/plate/plugins/element-types';

export const createMaltekstseksjonPlugin = createPluginFactory({
  key: ELEMENT_MALTEKSTSEKSJON,
  isElement: true,
  isVoid: false,
});
