import { PlainTextTypes, TextTypes } from '@app/types/common-text-types';
import { IPlainText, IRichText, IText } from '@app/types/texts/responses';

const PLAIN_TEXT_VALUES = Object.values(PlainTextTypes);

export const isPlainTextType = (textType: TextTypes): textType is PlainTextTypes =>
  PLAIN_TEXT_VALUES.some((t) => t === textType);

export const isPlainText = (text: IText): text is IPlainText => isPlainTextType(text.textType);
export const isRichText = (text: IText): text is IRichText => !isPlainText(text);
