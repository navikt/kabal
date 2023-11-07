import {
  DraftTextReadOnlyMetadata,
  ITextBaseMetadata,
  PublishedTextReadOnlyMetadata,
  TextReadOnlyMetadata,
} from '../common-text-types';
import { INewPlainTextParams, INewRichTextParams } from './common';

export type IRichText = IDraftRichText | IPublishedRichText;

export type IDraftRichText = INewRichTextParams &
  DraftTextReadOnlyMetadata & {
    id: string; // UUID
    modified: string; // Datetime
    created: string; // Datetime
  };

export interface IPublishedTextMetadata extends ITextBaseMetadata, PublishedTextReadOnlyMetadata {
  id: string; // UUID
  modified: string; // Datetime
  created: string; // Datetime
}

export interface IPublishedRichText extends IPublishedTextMetadata, INewRichTextParams {}
export interface IPublishedPlainText extends IPublishedTextMetadata, INewPlainTextParams {}

export type IPublishedText = IPublishedRichText | IPublishedPlainText;

export type IDraftPlainText = INewPlainTextParams &
  DraftTextReadOnlyMetadata & {
    id: string; // UUID
    modified: string; // Datetime
    created: string; // Datetime
  };

export type IPlainText = INewPlainTextParams &
  TextReadOnlyMetadata & {
    id: string; // UUID
    modified: string; // Datetime
    created: string; // Datetime
  };

export type IText = IRichText | IPlainText;
