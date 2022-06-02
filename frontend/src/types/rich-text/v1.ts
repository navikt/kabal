import { Descendant } from 'slate';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { ITextMetadata } from '../texts/texts';

export interface RichText_V1 {
  id: string;
  content: Descendant[];
  version: 1;
}

export interface RichText_V1_Text extends RichText_V1, ITextMetadata {}

export interface RichText_V1_SmartEditor extends RichText_V1, ISmartEditorMetadata {}