import { EditorValue } from '@app/plate/types';
import { Language } from '@app/types/texts/language';
import {
  DraftTextReadOnlyMetadata,
  ITextBaseMetadata,
  ITranslatedTextContent,
  PlainTextTypes,
  PublishedTextReadOnlyMetadata,
  RichTextTypes,
  TextReadOnlyMetadata,
} from '../common-text-types';
import { INewPlainTextParams, INewRichTextParams } from './common';

export type IRichText = IDraftRichText | IPublishedRichText;

export interface IDraftRichText extends ITextBaseMetadata, DraftTextReadOnlyMetadata {
  textType: RichTextTypes;
  id: string; // UUID
  modified: string; // Datetime
  created: string; // Datetime
  richText: ITranslatedTextContent;
}

export interface IPublishedTextMetadata extends ITextBaseMetadata, PublishedTextReadOnlyMetadata {
  id: string; // UUID
  modified: string; // Datetime
  created: string; // Datetime
}

export interface IPublishedRichText extends IPublishedTextMetadata, INewRichTextParams {
  richText: ITranslatedTextContent;
}
export interface IPublishedPlainText extends IPublishedTextMetadata, INewPlainTextParams {
  plainText: ITranslatedTextContent;
}

export type IPublishedText = IPublishedRichText | IPublishedPlainText;

export type IDraftPlainText = INewPlainTextParams &
  DraftTextReadOnlyMetadata & {
    id: string; // UUID
    modified: string; // Datetime
    created: string; // Datetime
    plainText: ITranslatedTextContent;
  };

export type IPlainText = INewPlainTextParams &
  TextReadOnlyMetadata & {
    id: string; // UUID
    modified: string; // Datetime
    created: string; // Datetime
    plainText: ITranslatedTextContent;
  };

export type IText = IRichText | IPlainText;

export interface PublishedTextVersion extends ITextBaseMetadata, PublishedTextReadOnlyMetadata {
  textType: RichTextTypes | PlainTextTypes;
  id: string;
}

export interface DraftTextVersion extends ITextBaseMetadata, DraftTextReadOnlyMetadata {
  textType: RichTextTypes | PlainTextTypes;
  id: string;
}

export interface PublishedRichTextVersion extends Omit<PublishedTextVersion, 'textType'> {
  textType: RichTextTypes;
  richText: EditorValue;
}

export interface PublishedPlainTextVersion extends Omit<PublishedTextVersion, 'textType'> {
  textType: PlainTextTypes;
  plainText: string;
}

export interface DraftRichTextVersion extends Omit<DraftTextVersion, 'textType'> {
  textType: RichTextTypes;
  richText: EditorValue;
}

export interface DraftPlainTextVersion extends Omit<DraftTextVersion, 'textType'> {
  textType: PlainTextTypes;
  plainText: string;
}

export type RichTextVersion = PublishedRichTextVersion | DraftRichTextVersion;
export type PlainTextVersion = PublishedPlainTextVersion | DraftPlainTextVersion;
export type TextVersion = RichTextVersion | PlainTextVersion;

export interface TranslatedRichTexts {
  [Language.NB]: EditorValue;
  [Language.NN]: EditorValue;
}

export interface TranslatedPlainTexts {
  [Language.NB]: string;
  [Language.NN]: string;
}

export interface SearchableTextItem {
  id: string;
  title: string;
  modified: string; // Siste endring i title, richtext (bokmål/nynorsk), plaintext (bokmål/nynorsk) eller metadata.
  publishedDateTime: string | null;
  created: string;
  textType: RichTextTypes | PlainTextTypes;
  richText: TranslatedRichTexts | null;
  plainText: TranslatedPlainTexts | null;
}

interface RichTextContent {
  richText: EditorValue;
  title: string;
  textType: RichTextTypes;
  id: string;
}

interface PlainTextContent {
  plainText: string;
  title: string;
  textType: PlainTextTypes;
  enhetIdList: string[];
  id: string;
}

export interface PublishedRichTextContent extends PublishedTextReadOnlyMetadata, RichTextContent {}

export interface DraftRichTextContent extends DraftTextReadOnlyMetadata, RichTextContent {}

export interface PublishedPlainTextContent extends PublishedTextReadOnlyMetadata, PlainTextContent {}

export interface DraftPlainTextContent extends DraftTextReadOnlyMetadata, PlainTextContent {
  modified: string; // Datetime
  created: string; // Datetime
}
