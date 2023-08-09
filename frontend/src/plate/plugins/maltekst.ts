import { AnyObject, createPluginFactory } from '@udecode/plate-common';
import { ELEMENT_MALTEKST } from '@app/plate/plugins/element-types';
import { EditorValue, RichTextEditor } from '@app/plate/types';

export const createMaltekstPlugin = createPluginFactory<AnyObject, EditorValue, RichTextEditor>({
  key: ELEMENT_MALTEKST,
  isElement: true,
  isVoid: false,
});
