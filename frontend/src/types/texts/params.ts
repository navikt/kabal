import type { KabalValue } from '@app/plate/types';
import type { IGetTextsParams, RichTextTypes } from '../common-text-types';
import type { Language, UNTRANSLATED } from './language';
import type { IText } from './responses';

export type { IGetTextsParams } from '../common-text-types';
export type { INewPlainTextParams, INewRichTextParams, INewTextParams } from './common';

/** Update params */

export interface IUpdateBaseParams {
  id: string;
  query: IGetTextsParams;
}

export interface IUpdateTextTypeParams {
  id: string;
  newTextType: RichTextTypes;
  oldTextType: RichTextTypes;
}

export interface IDeleteTextDraftParams extends IUpdateBaseParams {
  title: string;
  versions: IText[];
}

export interface IUpdateRichTextContentParams extends IUpdateBaseParams {
  richText: KabalValue | null;
  language: Language | typeof UNTRANSLATED;
}

export interface IUpdateTextPlainTextParams extends IUpdateBaseParams {
  plainText: string | null;
  language: Language | typeof UNTRANSLATED;
}

export interface IUpdateTextTemplateSectionIdListParams extends IUpdateBaseParams {
  templateSectionIdList: string[];
}

export interface IUpdateTextYtelseHjemmelIdListParams extends IUpdateBaseParams {
  ytelseHjemmelIdList: string[];
}

export interface IUpdateTextUtfallIdListParams extends IUpdateBaseParams {
  utfallIdList: string[];
}

export interface IUpdateTextEnheterParams extends IUpdateBaseParams {
  enhetIdList: string[];
}

export interface IUnpublishTextParams {
  query: IGetTextsParams;
  publishedText: IText;
  textDraft: IText | undefined;
}

export interface ICreateDraftFromVersionParams {
  id: string;
  title: string;
  versionId: string;
  query: IGetTextsParams;
}
