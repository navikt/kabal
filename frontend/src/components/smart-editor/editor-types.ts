import { BaseRange } from 'slate';
import {
  ContentTypeEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  TextAlignEnum,
  VoidElementsEnum,
} from './editor-enums';

export const VOID_ELEMENT_TYPES = Object.values(VoidElementsEnum);

export interface ParagraphElementType {
  type: ContentTypeEnum.PARAGRAPH;
  children: CustomTextType[];
  textAlign: TextAlignEnum;
}

export interface BlockquoteElementType {
  type: ContentTypeEnum.BLOCKQUOTE;
  children: CustomTextType[];
  textAlign: TextAlignEnum;
}

export type AlignableElementTypes = ParagraphElementType | BlockquoteElementType;
export type MarkableElementTypes = ParagraphElementType | BlockquoteElementType | ListItemContainerElementType;
export type NonVoidElementTypes = ParagraphElementType | BlockquoteElementType | HeadingsType | ListsType;

export interface HeadingOneElementType {
  type: HeadingTypesEnum.HEADING_ONE;
  children: CustomTextType[];
}
export interface HeadingTwoElementType {
  type: HeadingTypesEnum.HEADING_TWO;
  children: CustomTextType[];
}
export interface HeadingThreeElementType {
  type: HeadingTypesEnum.HEADING_THREE;
  children: CustomTextType[];
}
export interface HeadingFourElementType {
  type: HeadingTypesEnum.HEADING_FOUR;
  children: CustomTextType[];
}
export interface HeadingFiveElementType {
  type: HeadingTypesEnum.HEADING_FIVE;
  children: CustomTextType[];
}
export interface HeadingSixElementType {
  type: HeadingTypesEnum.HEADING_SIX;
  children: CustomTextType[];
}

export type HeadingsType =
  | HeadingOneElementType
  | HeadingTwoElementType
  | HeadingThreeElementType
  | HeadingFourElementType
  | HeadingFiveElementType
  | HeadingSixElementType;

export interface BulletListElementType {
  type: ListTypesEnum.BULLET_LIST;
  children: ListItemElementType[];
}
export interface NumberedListElementType {
  type: ListTypesEnum.NUMBERED_LIST;
  children: ListItemElementType[];
}
export interface ListItemElementType {
  type: ListContentEnum.LIST_ITEM;
  children:
    | [ListItemContainerElementType, BulletListElementType | NumberedListElementType]
    | [ListItemContainerElementType]
    | [];
}

export interface ListItemContainerElementType {
  type: ListContentEnum.LIST_ITEM_CONTAINER;
  children: CustomTextType[];
}

export type ListsType =
  | BulletListElementType
  | NumberedListElementType
  | ListItemElementType
  | ListItemContainerElementType;

export type SecondLevelElementsType = ListItemElementType;

export enum MarkKeys {
  bold = 'bold',
  italic = 'italic',
  underline = 'underline',
  strikethrough = 'strikethrough',
  subscript = 'subscript',
  superscript = 'superscript',
}

export interface IMarks {
  [MarkKeys.bold]?: boolean;
  [MarkKeys.italic]?: boolean;
  [MarkKeys.underline]?: boolean;
  [MarkKeys.strikethrough]?: boolean;
  [MarkKeys.subscript]?: boolean;
  [MarkKeys.superscript]?: boolean;
}

export interface CustomTextType extends IMarks {
  text: string;
  selected?: boolean;
  [key: string]: boolean | string | undefined;
}

export interface CustomRange extends BaseRange {
  selected?: boolean;
}

export const MarkKeyList = Object.keys(MarkKeys);

export const hasAnyMark = (node: CustomTextType) => MarkKeyList.some((mk) => node[mk]);

export const hasAnyComments = (node: CustomTextType) => Object.keys(node).some((k) => k.startsWith('commentThreadId_'));
