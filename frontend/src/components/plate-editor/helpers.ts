import { ELEMENT_PARAGRAPH } from '@udecode/plate';
import { ParagraphElement, TextAlign } from '@app/components/plate-editor/types';

export const createEmtpyPlateParagraph = (): ParagraphElement => ({
  type: ELEMENT_PARAGRAPH,
  align: TextAlign.LEFT,
  children: [{ text: '' }],
});
