import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { IGetTextsParams, ITextBaseMetadata } from '../common-text-types';

export type { IGetTextsParams } from '../common-text-types';

/** Create params */
export interface INewMaltekstseksjonParams {
  maltekstseksjon: ITextBaseMetadata & { textIdList: string[] };
  query: IGetTextsParams;
}

/** Update params for maltekstseksjoner */

export interface IUpdateBaseParams {
  id: string;
  query: IGetTextsParams;
}

export interface IUpdateMaltekstseksjonTextIsListParams extends IUpdateBaseParams {
  textIdList: string[];
}

export interface IUpdateMaltekstseksjonTitleParams extends IUpdateBaseParams {
  title: string;
}

export interface IUnpublishMaltekstseksjonParams extends IUpdateBaseParams {
  title: string;
  maltekstseksjonDraft: IMaltekstseksjon | undefined;
}

export interface IUpdateMaltekstseksjonTemplateSectionParams extends IUpdateBaseParams {
  templateSectionIdList: string[];
}

export interface IUpdateMaltekstseksjonYtelseHjemmelParams extends IUpdateBaseParams {
  ytelseHjemmelIdList: string[];
}

export interface IUpdateMaltekstseksjonUtfallParams extends IUpdateBaseParams {
  utfallIdList: string[];
}

export interface ICreateDraftFromMaltekstseksjonVersionParams extends IUpdateBaseParams {
  versionId: string;
}

export interface IDeleteMaltekstDraftParams extends IUpdateBaseParams {
  title: string;
  lastPublishedVersion: IMaltekstseksjon | undefined;
}
