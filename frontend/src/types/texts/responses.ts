import { EditorValue } from '@app/plate/types';
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

export interface TextVersion extends ITextBaseMetadata, PublishedTextReadOnlyMetadata {
  textType: RichTextTypes | PlainTextTypes;
  id: string;
}

export interface RichTextVersion extends Omit<TextVersion, 'textType'> {
  textType: RichTextTypes;
  richText: EditorValue;
}

export interface PlainTextVersion extends Omit<TextVersion, 'textType'> {
  textType: PlainTextTypes;
  plainText: string;
}
