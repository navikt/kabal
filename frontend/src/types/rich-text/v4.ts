import { EditorValue, RootBlock } from '@app/components/plate-editor/types';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { ITextMetadata, RichTextTypes } from '../texts/texts';
import { PlainText_V3 } from './v3';

interface Base {
  readonly version: 4;
}

export interface PlainText_V4 extends Omit<PlainText_V3, 'version'>, Base {}

export interface RichText_V4 extends Base {
  readonly content: RichText_Content_V4[];
  readonly textType: RichTextTypes;
}

type RichText_Content_V4 = RootBlock;

export type RichText_V4_Text = (RichText_V4 & ITextMetadata) | (PlainText_V4 & ITextMetadata);

export type RichText_V4_SmartEditor = RichText_V4 & ISmartEditorMetadata;
