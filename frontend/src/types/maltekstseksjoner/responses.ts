import { INavEmployee } from '@app/types/bruker';
import { IPublishedRichText } from '../texts/responses';

enum MaltekstseksjonChangeType {
  MALTEKSTSEKSJON_TITLE = 'MALTEKSTSEKSJON_TITLE',
  MALTEKSTSEKSJON_TEXTS = 'MALTEKSTSEKSJON_TEXTS',
  MALTEKSTSEKSJON_VERSION_CREATED = 'MALTEKSTSEKSJON_VERSION_CREATED',
  SMART_EDITOR_VERSION = 'SMART_EDITOR_VERSION',
  MALTEKSTSEKSJON_UTFALL = 'MALTEKSTSEKSJON_UTFALL',
  MALTEKSTSEKSJON_ENHETER = 'MALTEKSTSEKSJON_ENHETER',
  MALTEKSTSEKSJON_SECTIONS = 'MALTEKSTSEKSJON_SECTIONS',
  MALTEKSTSEKSJON_YTELSE_HJEMMEL = 'MALTEKSTSEKSJON_YTELSE_HJEMMEL',
  UNKNOWN = 'UNKNOWN',
}

export interface IEditor {
  actor: INavEmployee;
  created: string;
  changeType: MaltekstseksjonChangeType;
}

interface Filters {
  templateSectionIdList: string[];
  ytelseHjemmelIdList: string[];
  utfallIdList: string[];
  enhetIdList: string[];
  title: string;
}

interface ReadOnlyMetadata {
  readonly id: string; // UUID
  readonly modified: string; // Datetime
  readonly created: string; // Datetime
  readonly edits: IEditor[];
  readonly versionId: string;
  readonly draftMaltekstseksjonIdList: string[];
  readonly publishedMaltekstseksjonIdList: string[];
}

interface PublishedReadOnlyMetadata extends ReadOnlyMetadata {
  readonly published: boolean;
  readonly publishedByActor: INavEmployee;
  readonly publishedDateTime: string;
}

interface DraftReadOnlyMetadata extends ReadOnlyMetadata {
  readonly published: false;
  readonly publishedByActor: null;
  readonly publishedDateTime: null;
}

export type IPublishedMaltekstseksjon = Filters &
  PublishedReadOnlyMetadata & {
    readonly textIdList: string[];
    readonly modified: string; // Datetime
    readonly created: string; // Datetime
    readonly createdByActor: INavEmployee;
  };

export type IDraftMaltekstseksjon = Filters &
  DraftReadOnlyMetadata & {
    readonly textIdList: string[];
    readonly modified: string; // Datetime
    readonly created: string; // Datetime
    readonly createdByActor: INavEmployee;
  };

export type IMaltekstseksjon = IPublishedMaltekstseksjon | IDraftMaltekstseksjon;

export interface IPublishWithTextsResponse {
  readonly maltekstseksjon: IPublishedMaltekstseksjon;
  readonly publishedTexts: IPublishedRichText[];
}
