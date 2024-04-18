import { Language } from '@app/types/texts/language';

export interface IEditor {
  created: string;
  modified: string;
  navIdent: string;
}

interface TextMetadata {
  templateSectionIdList: string[];
  ytelseHjemmelIdList: string[];
  utfallIdList: string[];
  enhetIdList: string[];
}

export interface ITextBaseMetadata extends TextMetadata {
  title: string;
}

export interface ITranslatedTextContent {
  /** List of version IDs. */
  [Language.NB]: string[];
  /** List of version IDs. */
  [Language.NN]: string[];
}

export interface PublishedTextReadOnlyMetadata {
  readonly published: boolean;
  readonly publishedBy: string | 'LOADING';
  readonly publishedDateTime: string;
  readonly editors: IEditor[];
  readonly modified: string;
  readonly created: string;
  readonly versionId: string;
  readonly draftMaltekstseksjonIdList: string[];
  readonly publishedMaltekstseksjonIdList: string[];
}

export interface DraftTextReadOnlyMetadata {
  readonly published: false;
  readonly publishedBy: null;
  readonly publishedDateTime: null;
  readonly editors: IEditor[];
  readonly modified: string;
  readonly created: string;
  readonly versionId: string;
  readonly draftMaltekstseksjonIdList: string[];
  readonly publishedMaltekstseksjonIdList: string[];
}

export type TextReadOnlyMetadata = PublishedTextReadOnlyMetadata | DraftTextReadOnlyMetadata;

export enum RichTextTypes {
  GOD_FORMULERING = 'GOD_FORMULERING',
  MALTEKST = 'MALTEKST',
  MALTEKSTSEKSJON = 'MALTEKSTSEKSJON',
  REDIGERBAR_MALTEKST = 'REDIGERBAR_MALTEKST',
  REGELVERK = 'REGELVERK',
}

export enum PlainTextTypes {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
}

export interface AppQuery {
  // Redaktørquery?
  templateSectionIdList?: string[];
  ytelseHjemmelIdList?: string[];
  utfallIdList?: string;
  enhetIdList?: string[];
  // language: Language;
}

export interface ApiQuery extends AppQuery {
  textType: RichTextTypes | PlainTextTypes;
}

export interface ConsumerQuery extends AppQuery {
  textType: RichTextTypes | PlainTextTypes;
  language: Language;
}

// export type IGetTextsParams = ApiQuery;
export type IGetTextsParams = Partial<ApiQuery>;

export type TextTypes = RichTextTypes | PlainTextTypes;
