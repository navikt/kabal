import type { EditorValue } from '@app/plate/types';
import {
  GOD_FORMULERING_TYPE,
  type PlainTextTypes,
  type REGELVERK_TYPE,
  type RichTextTypes,
} from '@app/types/common-text-types';
import type { Language } from '@app/types/texts/language';
import type { INewPlainTextParams, INewRegelverkParams, INewRichTextParams } from './common';

interface ConsumerMetadata {
  id: string;
  publishedDateTime: string;
  language: Language;
}

export interface IConsumerPlainText extends ConsumerMetadata, Omit<INewPlainTextParams, 'plainText' | 'textType'> {
  textType: PlainTextTypes;
  plainText: string;
}

export interface IConsumerRichText extends ConsumerMetadata, Omit<INewRichTextParams, 'richText' | 'textType'> {
  textType: RichTextTypes;
  richText: EditorValue;
}

export interface IConsumerRegelverkText extends ConsumerMetadata, Omit<INewRegelverkParams, 'richText' | 'textType'> {
  textType: typeof REGELVERK_TYPE;
  richText: EditorValue;
}

interface IConsumerGodFormuleringText extends ConsumerMetadata, Omit<INewRichTextParams, 'richText' | 'textType'> {
  textType: typeof GOD_FORMULERING_TYPE;
  richText: EditorValue;
}

export interface NonNullableGodFormulering extends Omit<IConsumerGodFormuleringText, 'richText'> {
  richText: EditorValue;
}

const isGodFormulering = (text: IConsumerText): text is IConsumerGodFormuleringText =>
  text.textType === GOD_FORMULERING_TYPE;

export const isNonNullGodFormulering = (text: IConsumerText): text is NonNullableGodFormulering =>
  isGodFormulering(text) && text.richText !== null;

export const isConsumerRichText = (
  text: IConsumerText,
): text is IConsumerRichText | IConsumerRegelverkText | IConsumerGodFormuleringText =>
  'richText' in text && Array.isArray(text.richText);

export type IConsumerText =
  | IConsumerRichText
  | IConsumerPlainText
  | IConsumerRegelverkText
  | IConsumerGodFormuleringText;
