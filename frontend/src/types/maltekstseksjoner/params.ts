import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import type { IGetMaltekstseksjonParams, ITextBaseMetadata } from '../common-text-types';

export type { IGetMaltekstseksjonParams } from '../common-text-types';

/** Create params */
export interface INewMaltekstseksjonParams {
  maltekstseksjon: ITextBaseMetadata & { textIdList: string[] };
  query: IGetMaltekstseksjonParams;
}

/** Update params for maltekstseksjoner */

export interface IUpdateBaseParams {
  id: string;
  query: IGetMaltekstseksjonParams;
}

export interface IUpdateMaltekstseksjonTextIsListParams extends IUpdateBaseParams {
  textIdList: string[];
}

export interface IUpdateMaltekstseksjonTitleParams extends IUpdateBaseParams {
  title: string;
}

export interface IUnpublishMaltekstseksjonParams {
  query: IGetMaltekstseksjonParams;
  publishedMaltekstseksjon: IMaltekstseksjon;
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
  versions: IMaltekstseksjon[];
}
