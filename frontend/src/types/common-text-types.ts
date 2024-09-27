import { Language, UNTRANSLATED } from '@app/types/texts/language';

export enum TextChangeType {
  RICH_TEXT_NB = 'RICH_TEXT_NB',
  RICH_TEXT_NN = 'RICH_TEXT_NN',
  RICH_TEXT_UNTRANSLATED = 'RICH_TEXT_UNTRANSLATED',
  PLAIN_TEXT_NB = 'PLAIN_TEXT_NB',
  PLAIN_TEXT_NN = 'PLAIN_TEXT_NN',
  TEXT_TYPE = 'TEXT_TYPE',
  TEXT_VERSION_CREATED = 'TEXT_VERSION_CREATED',
  TEXT_TITLE = 'TEXT_TITLE',
  TEXT_UTFALL = 'TEXT_UTFALL',
  TEXT_SECTIONS = 'TEXT_SECTIONS',
  TEXT_YTELSE_HJEMMEL = 'TEXT_YTELSE_HJEMMEL',
  SMART_EDITOR_VERSION = 'SMART_EDITOR_VERSION',
  TEXT_ENHETER = 'TEXT_ENHETER',
  UNKNOWN = 'UNKNOWN',
}

export interface IEditor {
  created: string;
  changeType: TextChangeType;
  navIdent: string;
}

export interface ITextBaseMetadata {
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
  readonly editors: IEditor[];
  readonly versionId: string;
  readonly draftMaltekstseksjonIdList: string[];
  readonly publishedMaltekstseksjonIdList: string[];
}

export interface PublishedTextReadOnlyMetadata extends ReadOnlyMetadata {
  readonly published: boolean;
  readonly publishedBy: string | 'LOADING';
  readonly publishedDateTime: string;
}

export interface DraftTextReadOnlyMetadata extends ReadOnlyMetadata {
  readonly published: false;
  readonly publishedBy: null;
  readonly publishedDateTime: null;
}

export enum RichTextTypes {
  MALTEKST = 'MALTEKST',
  REDIGERBAR_MALTEKST = 'REDIGERBAR_MALTEKST',
}

export enum PlainTextTypes {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
}

export interface IGetMaltekstseksjonParams {
  templateSectionIdList?: string[];
  ytelseHjemmelIdList?: string[];
  utfallIdList?: string;
  enhetIdList?: string[];
  trash: boolean;
}

export interface IGetTextsParams extends IGetMaltekstseksjonParams {
  textType: TextTypes;
}

/** Deprecated
 * @deprecated Remove when no longer in use by legacy (redigerbar) maltekst.
 */
export interface IGetConsumerTextsParams extends Omit<IGetTextsParams, 'trash'> {
  language: Language | typeof UNTRANSLATED;
}

export interface IGetConsumerMaltekstseksjonerParams {
  ytelseHjemmelIdList: string[];
  templateSectionIdList: string[];
  utfallIdList: string;
  textType: typeof MALTEKSTSEKSJON_TYPE;
  language: Language;
}

export interface IGetConsumerGodFormuleringParams {
  ytelseHjemmelIdList: string[];
  templateSectionIdList: string[];
  utfallIdList: string;
  textType: typeof GOD_FORMULERING_TYPE;
  language: Language;
}

export interface IGetConsumerRegelverkParams {
  ytelseHjemmelIdList: string[];
  utfallIdList: string;
  textType: typeof REGELVERK_TYPE;
  language: typeof UNTRANSLATED;
}

export interface IGetConsumerHeaderFooterParams extends Omit<IGetMaltekstseksjonParams, 'trash'> {
  textType: PlainTextTypes;
  language: Language;
}

export interface IGetConsumerTextParams {
  language: Language | typeof UNTRANSLATED;
  textId: string;
}

export const REGELVERK_TYPE = 'REGELVERK';
export const GOD_FORMULERING_TYPE = 'GOD_FORMULERING';
export const MALTEKSTSEKSJON_TYPE = 'MALTEKSTSEKSJON';
export type TextTypes =
  | RichTextTypes
  | PlainTextTypes
  | typeof REGELVERK_TYPE
  | typeof GOD_FORMULERING_TYPE
  | typeof MALTEKSTSEKSJON_TYPE;
