import { Descendant } from 'slate';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { ITextMetadata, RichTextTypes } from '../texts/texts';

export interface RichText_V2 {
  id: string;
  content: Descendant[];
  version: 2;
  textType: RichTextTypes;
}

export interface RichText_V2_Text extends RichText_V2, ITextMetadata {}

export interface RichText_V2_SmartEditor extends RichText_V2, ISmartEditorMetadata {}
