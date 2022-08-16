import { BaseRange, Descendant } from 'slate';
import { TemplateSections, TextMetadata } from '../../../types/texts/texts';
import { FlettefeltElementType } from './deletable-void-types';
import {
  ContentTypeEnum,
  DeletableVoidElementsEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  RedigerbarMaltekstEnum,
  TextAlignEnum,
  UndeletableVoidElementsEnum,
} from './editor-enums';
import { IMarks, MarkKeys } from './marks';

export const VOID_ELEMENT_TYPES = [
  ...Object.values(UndeletableVoidElementsEnum),
  ...Object.values(DeletableVoidElementsEnum),
];

export interface ParagraphElementType {
  type: ContentTypeEnum.PARAGRAPH;
  children: CustomTextType[];
  textAlign: TextAlignEnum;
}

export interface IndentElementType {
  type: ContentTypeEnum.INDENT;
  children: CustomTextType[];
}

interface BlockquoteElementType {
  type: ContentTypeEnum.BLOCKQUOTE;
  children: CustomTextType[];
  textAlign: TextAlignEnum;
}

export type AlignableElementTypes = ParagraphElementType | BlockquoteElementType;

export type MarkableElementTypes =
  | ParagraphElementType
  | IndentElementType
  | BlockquoteElementType
  | ListItemContainerElementType
  | FlettefeltElementType;

export type NonVoidElementTypes =
  | ParagraphElementType
  | IndentElementType
  | BlockquoteElementType
  | HeadingsType
  | ListsType
  | RedigerbareMalteksterElementType;

export interface RedigerbareMalteksterElementType extends Partial<TextMetadata> {
  type: RedigerbarMaltekstEnum;
  section: TemplateSections;
  children: Descendant[];
}

export interface HeadingOneElementType {
  type: HeadingTypesEnum.HEADING_ONE;
  children: CustomTextType[];
}
export interface HeadingTwoElementType {
  type: HeadingTypesEnum.HEADING_TWO;
  children: CustomTextType[];
}
interface HeadingThreeElementType {
  type: HeadingTypesEnum.HEADING_THREE;
  children: CustomTextType[];
}
interface HeadingFourElementType {
  type: HeadingTypesEnum.HEADING_FOUR;
  children: CustomTextType[];
}
interface HeadingFiveElementType {
  type: HeadingTypesEnum.HEADING_FIVE;
  children: CustomTextType[];
}
interface HeadingSixElementType {
  type: HeadingTypesEnum.HEADING_SIX;
  children: CustomTextType[];
}

type HeadingsType =
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

type ListsType = BulletListElementType | NumberedListElementType | ListItemElementType | ListItemContainerElementType;

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
