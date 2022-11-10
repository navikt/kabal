import { Descendant, Element } from 'slate';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { ITextMetadata, PlainTextTypes, RichTextTypes } from '../texts/texts';

export const INDENT_TYPE = 'indent';

export interface IndentElementType {
  type: typeof INDENT_TYPE;
  children: Element[];
  indent?: number;
}

export type RichText_Content_V2 = Descendant | IndentElementType;

interface Base {
  readonly version: 2;
}

export interface PlainText_V2 extends Base {
  readonly textType: PlainTextTypes;
  readonly plainText: string;
}

export interface RichText_V2 extends Base {
  readonly content: RichText_Content_V2[];
  readonly textType: RichTextTypes;
}

export type RichText_V2_Text = (RichText_V2 | PlainText_V2) & ITextMetadata;

export type RichText_V2_SmartEditor = RichText_V2 & ISmartEditorMetadata;
