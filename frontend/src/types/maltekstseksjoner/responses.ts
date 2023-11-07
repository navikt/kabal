import { IPublishedRichText } from '@app/types/texts/responses';
import { DraftTextReadOnlyMetadata, ITextBaseMetadata, PublishedTextReadOnlyMetadata } from '../common-text-types';

interface ITextMetadata extends ITextBaseMetadata {
  id: string;
}

export type IPublishedMaltekstseksjon = ITextMetadata &
  PublishedTextReadOnlyMetadata & {
    readonly textIdList: string[];
    readonly modified: string; // Datetime
    readonly created: string; // Datetime
    readonly createdBy: string;
  };

export type IDraftMaltekstseksjon = ITextMetadata &
  DraftTextReadOnlyMetadata & {
    readonly textIdList: string[];
    readonly modified: string; // Datetime
    readonly created: string; // Datetime
    readonly createdBy: string;
  };

export type IMaltekstseksjon = IPublishedMaltekstseksjon | IDraftMaltekstseksjon;

export interface IPublishWithTextsResponse {
  readonly maltekstseksjon: IPublishedMaltekstseksjon;
  readonly publishedTexts: IPublishedRichText[];
}
