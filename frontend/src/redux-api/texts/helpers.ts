import { isPlainText, isRichText } from '@app/functions/is-rich-plain-text';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { LANGUAGES } from '@app/types/texts/language';
import { IText } from '@app/types/texts/responses';

export const insertFallbackText = (text: IText) => {
  if (isRichText(text)) {
    const { richText } = text;

    for (const lang of LANGUAGES) {
      if (richText[lang] === null || richText[lang] === undefined) {
        richText[lang] = [createSimpleParagraph(`Oversettelse for ${lang} mangler`)];
      }
    }

    return { ...text, richText };
  }

  if (isPlainText(text)) {
    const { plainText } = text;

    for (const lang of LANGUAGES) {
      if (plainText[lang] === null || plainText[lang] === undefined) {
        plainText[lang] = `Oversettelse for ${lang} mangler`;
      }
    }

    return { ...text, plainText };
  }

  return text;
};
