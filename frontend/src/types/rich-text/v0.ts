import { Descendant, Element } from 'slate';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { NoTemplateIdEnum } from '../smart-editor/template-enums';
import { ITextMetadata } from '../texts/texts';

export interface RichText_V0 {
  id: string;
  content: (Descendant | Maltekst_V0)[];
  version?: 0;
  templateId: NoTemplateIdEnum | null;
}

export interface RichText_V0_Text extends RichText_V0, ITextMetadata {}

export interface RichText_V0_SmartEditor extends RichText_V0, Omit<ISmartEditorMetadata, 'templateId' | 'version'> {}

export interface Maltekst_V0 {
  type: 'maltekst';
  children: [{ text: '' }];
  maltekst: Element[];
  source: string;
  threadIds: string[];
}
