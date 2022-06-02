import { Descendant } from 'slate';
import { VERSION } from '../../components/rich-text/version';
import { Utfall } from '../kodeverk';
import { NoTemplateIdEnum, TemplateIdEnum } from '../smart-editor/template-enums';

// No specific order.
export enum TemplateSections {
  HEADER = 'section-header',
  FOOTER = 'section-footer',
  TITLE = 'section-esel',
  INTRODUCTION = 'section-rev',
  KONKLUSJON = 'section-elg',
  ANKEINFO = 'section-ape',
  KLAGER_VEKTLAGT = 'section-ulv',
  VURDERINGEN = 'section-mus',
  OPPLYSNINGER = 'section-sau',
  GENERELL_INFO = 'section-sel',
  AVGJOERELSE = 'section-mår',
  REGELVERK = 'section-gnu',
  VI_VEKTLAGT = 'section-oter',
  SAKSKOSTNADER = 'section-gris',
}

export type AllMaltekstSections = TemplateSections;

export interface AppQuery {
  hjemler: string[];
  ytelser: string[];
  utfall: Utfall[];
  enheter: string[];
  sections: TemplateSections[];
  templates: (TemplateIdEnum | NoTemplateIdEnum)[];
}

interface BaseQuery extends AppQuery {
  textType: TextTypes;
}

export interface ApiQuery extends BaseQuery {
  requiredSection?: TemplateSections;
}

export type TextMetadata = AppQuery;

export enum TextTypes {
  GOD_FORMULERING = 'GOD_FORMULERING',
  MALTEKST = 'MALTEKST',
  REDIGERBAR_MALTEKST = 'REDIGERBAR_MALTEKST',
  REGELVERK = 'REGELVERK',
}

export type IGetTextsParams = Partial<ApiQuery>;

export interface ITextBaseMetadata extends BaseQuery {
  title: string;
}

export interface ITextMetadata extends ITextBaseMetadata {
  id: string;
}

export interface INewTextParams extends ITextBaseMetadata {
  content: Descendant[];
  version: typeof VERSION;
}

export interface IUpdateText extends INewTextParams, ITextMetadata {}

export type IUpdatable = Omit<IUpdateText, 'id'>;

export interface IUpdateTextPropertyParams<K extends keyof IUpdatable = keyof IUpdatable> {
  id: IUpdateText['id'];
  key: K;
  value: IUpdatable[K];
  query: IGetTextsParams;
}

export interface IText extends INewTextParams {
  id: string; // UUID
  modified: string | null; // Datetime
  created: string; // Datetime
}
