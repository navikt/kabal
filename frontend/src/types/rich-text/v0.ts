import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { NoTemplateIdEnum } from '../smart-editor/template-enums';
import { ITextMetadata, RichTextTypes } from '../texts/texts';
import { RichText_Content_V2 } from './v2';

export interface RichText_V0 {
  id: string;
  content: (RichText_Content_V2 | Maltekst_V0)[];
  version?: 0;
  templateId: NoTemplateIdEnum | null;
  textType: RichTextTypes;
}

export interface RichText_V0_Text extends RichText_V0, ITextMetadata {}

export interface RichText_V0_SmartEditor extends RichText_V0, Omit<ISmartEditorMetadata, 'templateId' | 'version'> {}

export interface Maltekst_V0 {
  type: 'maltekst';
  children: [{ text: '' }];
  maltekst: RichText_Content_V2[];
  source: string;
  threadIds: string[];
}
