import { BaseEditor, BaseRange, Element, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export enum ContentTypeEnum {
  PARAGRAPH = 'paragraph',
  BLOCKQUOTE = 'blockquote',
}

export enum ListTypesEnum {
  BULLET_LIST = 'bullet-list',
  NUMBERED_LIST = 'numbered-list',
  LIST_ITEM = 'list-item',
}

export enum HeadingTypesEnum {
  HEADING_ONE = 'heading-one',
  HEADING_TWO = 'heading-two',
  HEADING_THREE = 'heading-three',
  HEADING_FOUR = 'heading-four',
  HEADING_FIVE = 'heading-five',
  HEADING_SIX = 'heading-six',
}

export const AlignableTypeEnum = { ...ContentTypeEnum };
export const MarkableTypeEnum = { ...ContentTypeEnum, ...ListTypesEnum };

export enum TextAlignEnum {
  TEXT_ALIGN_LEFT = 'text-align-left',
  TEXT_ALIGN_RIGHT = 'text-align-right',
  TEXT_ALIGN_CENTER = 'text-align-center',
  TEXT_ALIGN_JUSTIFY = 'text-align-justify',
}

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
export type MarkableElementTypes =
  | ParagraphElementType
  | BlockquoteElementType
  | ListItemElementType
  | BulletListElementType
  | NumberedListElementType;

export type ElementTypes = ContentTypeEnum | HeadingTypesEnum | ListTypesEnum;

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
  type: ListTypesEnum.LIST_ITEM;
  children: CustomTextType[];
}
export type ListsType = BulletListElementType | NumberedListElementType | ListItemElementType;

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

interface CustomRange extends BaseRange {
  selected?: boolean;
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: ParagraphElementType | BlockquoteElementType | HeadingsType | ListsType;
    Text: CustomTextType;
    Range: CustomRange;
  }
}

export const isOfElementType = <T extends ParagraphElementType | HeadingsType | ListsType>(
  n: Node,
  type: ElementTypes
): n is T => Element.isElement(n) && n.type === type;

export const isNodeOfSameElementType = <T extends Element>(n: Node, element: T): n is T =>
  Element.isElement(n) && n.type === element.type;

export const isTypeAlignable = (type: HeadingTypesEnum | ListTypesEnum | ContentTypeEnum): type is ContentTypeEnum => {
  for (const alignableType of Object.values(AlignableTypeEnum)) {
    if (type === alignableType) {
      return true;
    }
  }

  return false;
};

export const isNodeAlignableElementType = (n: Node): n is AlignableElementTypes => {
  if (!Element.isElement(n)) {
    return false;
  }

  return isTypeAlignable(n.type);
};

export const isNodeMarkableElementType = (n: Node): n is MarkableElementTypes => {
  if (!Element.isElement(n)) {
    return false;
  }

  for (const type of Object.values(MarkableTypeEnum)) {
    if (n.type === type) {
      return true;
    }
  }

  return false;
};

export const MarkKeyList = Object.keys(MarkKeys);

export const isMarkKey = (s: string): s is MarkKeys => MarkKeyList.includes(s);

export const hasAnyMark = (node: CustomTextType) => MarkKeyList.some((mk) => node[mk]);

export const hasAnyComments = (node: CustomTextType) => Object.keys(node).some((k) => k.startsWith('commentThreadId_'));
