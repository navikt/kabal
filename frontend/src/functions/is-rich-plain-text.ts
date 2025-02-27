import {
  GOD_FORMULERING_TYPE,
  PlainTextTypes,
  REGELVERK_TYPE,
  RichTextTypes,
  type TextTypes,
} from '@app/types/common-text-types';
import type { ListGodFormulering, ListPlainText, ListRegelverk, ListRichText } from '@app/types/texts/common';
import type { IGodFormulering, IPlainText, IRegelverk, IRichText, IText, ListText } from '@app/types/texts/responses';

const PLAIN_TEXT_VALUES = Object.values(PlainTextTypes);
const RICH_TEXT_VALUES = Object.values(RichTextTypes);

export const isPlainTextType = (textType: TextTypes): textType is PlainTextTypes =>
  PLAIN_TEXT_VALUES.some((t) => t === textType);

export const isRichTextType = (textType: TextTypes): textType is RichTextTypes =>
  RICH_TEXT_VALUES.some((t) => t === textType);

export const isRegelverkType = (textType: TextTypes): textType is typeof REGELVERK_TYPE => textType === REGELVERK_TYPE;

export const isGodFormuleringType = (textType: TextTypes): textType is typeof GOD_FORMULERING_TYPE =>
  textType === GOD_FORMULERING_TYPE;

export const isPlainText = (text: IText): text is IPlainText => isPlainTextType(text.textType);
export const isRegelverk = (text: IText): text is IRegelverk => isRegelverkType(text.textType);
export const isRichText = (text: IText): text is IRichText => isRichTextType(text.textType);
export const isGodFormulering = (text: IText): text is IGodFormulering => isGodFormuleringType(text.textType);

export const isListPlainText = (text: ListText): text is ListPlainText => isPlainTextType(text.textType);
export const isListRegelverk = (text: ListText): text is ListRegelverk => isRegelverkType(text.textType);
export const isListRichText = (text: ListText): text is ListRichText => isRichTextType(text.textType);
export const isListGodFormulering = (text: ListText): text is ListGodFormulering => isGodFormuleringType(text.textType);
