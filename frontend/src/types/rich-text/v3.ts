import { Descendant } from 'slate';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { ITextMetadata, PlainTextTypes, RichTextTypes } from '../texts/texts';

interface Base {
  readonly version: 3;
}

export interface PlainText_V3 extends Base {
  readonly textType: PlainTextTypes;
  readonly plainText: string;
}

export interface RichText_V3 extends Base {
  readonly content: Descendant[];
  readonly textType: RichTextTypes;
}

export type RichText_V3_Text = (RichText_V3 & ITextMetadata) | (PlainText_V3 & ITextMetadata);

export type RichText_V3_SmartEditor = RichText_V3 & ISmartEditorMetadata;
