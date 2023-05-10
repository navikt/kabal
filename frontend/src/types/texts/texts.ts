import { EditorValue, RichTextEditorElements, TopLevelElements } from '@app/components/plate-editor/types';
import { VERSION } from '@app/components/rich-text/version';
import { NONE_TYPE } from '@app/components/smart-editor-texts/types';
import { UtfallEnum } from '../kodeverk';
import { NoTemplateIdEnum, TemplateIdEnum } from '../smart-editor/template-enums';

/* 
  Why animals?
  
  Short, non-sortable.
  No need for UUIDs.
  Many to choose from.

  https://en.wikipedia.org/wiki/Haiku
*/
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
  hjemler: (string | NONE_TYPE)[];
  ytelser: (string | NONE_TYPE)[];
  utfall: (UtfallEnum | NONE_TYPE)[];
  enheter: (string | NONE_TYPE)[];
  sections: (TemplateSections | NONE_TYPE)[];
  templates: (TemplateIdEnum | NoTemplateIdEnum | NONE_TYPE)[];
}

export interface TextMetadata {
  hjemler: string[];
  ytelser: string[];
  utfall: UtfallEnum[];
  enheter: string[];
  sections: TemplateSections[];
  templates: (TemplateIdEnum | NoTemplateIdEnum)[];
}

export interface ApiQuery extends AppQuery {
  textType: RichTextTypes | PlainTextTypes;
}

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

export interface ITextBaseMetadata extends TextMetadata {
  title: string;
}

export interface ITextMetadata extends ITextBaseMetadata {
  id: string;
}

export interface INewRichTextParams extends ITextBaseMetadata {
  textType: RichTextTypes;
  content: EditorValue;
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
