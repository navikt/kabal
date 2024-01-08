import { EditorValue } from '@app/plate/types';
import { IGetTextsParams, RichTextTypes } from '../common-text-types';
import { IText } from './responses';

export type { INewTextParams, INewPlainTextParams, INewRichTextParams } from './common';
export type { IGetTextsParams } from '../common-text-types';

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

export interface IUpdateTextContentParams extends IUpdateBaseParams {
  content: EditorValue;
}

export interface IUpdateTextPlainTextParams extends IUpdateBaseParams {
  plainText: string;
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
