import { ELEMENT_MALTEKSTSEKSJON } from '@app/plate/plugins/element-types';
import { createPluginFactory } from '@udecode/plate-common';

export const createMaltekstseksjonPlugin = createPluginFactory({
  key: ELEMENT_MALTEKSTSEKSJON,
  isElement: true,
  isVoid: false,
});
