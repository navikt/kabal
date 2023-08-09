import { createPluginFactory } from '@udecode/plate-common';
import { EditorValue, RedigerbarMaltekstElement, RichTextEditor } from '@app/plate/types';
import { ELEMENT_REDIGERBAR_MALTEKST } from './element-types';

export const createRedigerbarMaltekstPlugin = createPluginFactory<
  RedigerbarMaltekstElement,
  EditorValue,
  RichTextEditor
>({
  key: ELEMENT_REDIGERBAR_MALTEKST,
  isElement: true,
  isVoid: false,
});
