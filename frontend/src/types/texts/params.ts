import { EditorValue } from '@app/plate/types';
import { IGetTextsParams, RichTextTypes } from '../common-text-types';
import { Language, UNTRANSLATED } from './language';
import { IText } from './responses';

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
  lastPublishedVersion: IText | undefined;
}

export interface IUpdateRichTextContentParams extends IUpdateBaseParams {
  richText: EditorValue | null;
  language: Language | typeof UNTRANSLATED;
}

export interface IUpdateTextPlainTextParams extends IUpdateBaseParams {
  plainText: string;
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

export interface IUnpublishTextParams extends IUpdateBaseParams {
  title: string;
  textDraft: IText | undefined;
}

export interface ICreateDraftFromVersionParams {
  id: string;
  title: string;
  versionId: string;
  query: IGetTextsParams;
}
