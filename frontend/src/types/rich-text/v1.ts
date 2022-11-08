import { Descendant } from 'slate';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { ITextMetadata, RichTextTypes } from '../texts/texts';

export interface RichText_V1 {
  id: string;
  content: Descendant[];
  version: 1;
  textType: RichTextTypes;
}

export interface RichText_V1_Text extends RichText_V1, ITextMetadata {}

export interface RichText_V1_SmartEditor extends RichText_V1, Omit<ISmartEditorMetadata, 'version'> {}
