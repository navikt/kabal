import { Descendant } from 'slate';
import { TableContentEnum, TableTypeEnum } from '../../components/rich-text/types/editor-enums';
import {
  CustomTextType,
  TableBodyElementType,
  TableCellElementType,
  TableElementType,
  TableRowElementType,
} from '../../components/rich-text/types/editor-types';
import { ISmartEditorMetadata } from '../smart-editor/metadata';
import { ITextMetadata, PlainTextTypes, RichTextTypes } from '../texts/texts';

interface Base {
  readonly version: 3;
}

export interface TableCellElementType_V3 {
  type: TableContentEnum.TD;
  children: CustomTextType[];
  colSpan: number;
}

interface TableRowElementType_V3 {
  type: TableContentEnum.TR;
  children: TableCellElementType_V3[];
}

interface TableBodyElementType_V3 {
  type: TableContentEnum.TBODY;
  children: TableRowElementType_V3[];
}

interface TableElementType_V3 {
  type: TableTypeEnum.TABLE;
  children: TableBodyElementType_V3[];
}

export interface PlainText_V3 extends Base {
  readonly textType: PlainTextTypes;
  readonly plainText: string;
}

export type RichText_Content_V3 =
  | Exclude<Descendant, TableElementType | TableBodyElementType | TableRowElementType | TableCellElementType>
  | TableElementType_V3
  | TableBodyElementType_V3
  | TableRowElementType_V3
  | TableCellElementType_V3;

export interface RichText_V3 extends Base {
  readonly content: RichText_Content_V3[];
  readonly textType: RichTextTypes;
}

export type RichText_V3_Text = (RichText_V3 & ITextMetadata) | (PlainText_V3 & ITextMetadata);

export type RichText_V3_SmartEditor = RichText_V3 & ISmartEditorMetadata;
