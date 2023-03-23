import { Descendant } from 'slate';
import { VERSION } from '@app/components/rich-text/version';
import { UtfallEnum } from '../kodeverk';
import { NoTemplateIdEnum, TemplateIdEnum } from '../smart-editor/template-enums';

// No specific order.
export enum TemplateSections {
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
  SAKSKOSTNADER = 'section-gris',
}

export interface AppQuery {
  hjemler: string[];
  ytelser: string[];
  utfall: UtfallEnum[];
  enheter: string[];
  sections: TemplateSections[];
  templates: (TemplateIdEnum | NoTemplateIdEnum)[];
}

interface BaseQuery extends AppQuery {
  textType: RichTextTypes | PlainTextTypes;
}

export interface ApiQuery extends BaseQuery {
  requiredSection?: TemplateSections;
}

export type TextMetadata = AppQuery;

export enum RichTextTypes {
  GOD_FORMULERING = 'GOD_FORMULERING',
  MALTEKST = 'MALTEKST',
  REDIGERBAR_MALTEKST = 'REDIGERBAR_MALTEKST',
  REGELVERK = 'REGELVERK',
}

export enum PlainTextTypes {
  HEADER = 'HEADER',
  FOOTER = 'FOOTER',
}

export type TextTypes = RichTextTypes | PlainTextTypes;

const PLAIN_TEXT_VALUES = Object.values(PlainTextTypes);

export const isPlainTextType = (textType: TextTypes): textType is PlainTextTypes =>
  PLAIN_TEXT_VALUES.some((t) => t === textType);

export const isPlainText = (text: IText): text is IPlainText => isPlainTextType(text.textType);

export type IGetTextsParams = Partial<ApiQuery>;

export interface ITextBaseMetadata extends AppQuery {
  title: string;
}

export interface ITextMetadata extends ITextBaseMetadata {
  id: string;
}

export interface INewRichTextParams extends ITextBaseMetadata {
  textType: RichTextTypes;
  content: Descendant[];
  version: typeof VERSION;
}

export interface INewPlainTextParams extends ITextBaseMetadata {
  textType: PlainTextTypes;
  plainText: string;
  version: typeof VERSION;
}

export type INewTextParams = INewRichTextParams | INewPlainTextParams;

export type IUpdateText = INewRichTextParams | INewPlainTextParams;

export interface IUpdatePlainTextProperty<K extends keyof INewPlainTextParams = keyof INewPlainTextParams> {
  key: K;
  value: INewPlainTextParams[K];
}

export interface IUpdatePlainTextPropertyParams<K extends keyof INewPlainTextParams = keyof INewPlainTextParams>
  extends IUpdatePlainTextProperty<K> {
  id: ITextMetadata['id'];
  query: IGetTextsParams;
}

export interface IUpdateRichTextProperty<K extends keyof INewRichTextParams = keyof INewRichTextParams> {
  key: K;
  value: INewRichTextParams[K];
}

export interface IUpdateRichTextPropertyParams<K extends keyof INewRichTextParams = keyof INewRichTextParams>
  extends IUpdateRichTextProperty<K> {
  id: ITextMetadata['id'];
  query: IGetTextsParams;
}

export interface IRichText extends INewRichTextParams {
  id: string; // UUID
  modified: string; // Datetime
  created: string; // Datetime
}

export interface IPlainText extends INewPlainTextParams {
  id: string; // UUID
  modified: string; // Datetime
  created: string; // Datetime
}

export type IText = IRichText | IPlainText;

export interface IUpdateTextParams {
  text: IText;
  query: IGetTextsParams;
}
