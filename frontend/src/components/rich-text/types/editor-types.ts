/* eslint-disable import/no-unused-modules */
import { BaseRange, Element } from 'slate';
import { PageBreakElementType, VoidElementTypes } from '@app/components/rich-text/types/editor-void-types';
import { TemplateSections } from '@app/types/texts/template-sections';
import { TextMetadata } from '@app/types/texts/texts';
import { COMMENT_PREFIX } from '../../smart-editor/constants';
import {
  ContentTypeEnum,
  DeletableVoidElementsEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  RedigerbarMaltekstEnum,
  TableContentEnum,
  TableTypeEnum,
  TextAlignEnum,
  UndeletableContentEnum,
  UndeletableVoidElementsEnum,
} from './editor-enums';
import { IMarks, MarkKeys } from './marks';

export type EditorElement = NonVoidElementTypes | VoidElementTypes;
export type Descendant = EditorElement | CustomTextType;

export const VOID_ELEMENT_TYPES = [
  ...Object.values(UndeletableVoidElementsEnum),
  ...Object.values(DeletableVoidElementsEnum),
];

export interface ParagraphElementType {
  type: ContentTypeEnum.PARAGRAPH;
  children: CustomTextType[];
  textAlign: TextAlignEnum;
  indent: number;
}

export interface IndentElementType {
  type: ContentTypeEnum.INDENT;
  children: Element[];
}

export interface BlockquoteElementType {
  type: ContentTypeEnum.BLOCKQUOTE;
  children: CustomTextType[];
  textAlign: TextAlignEnum;
}

export interface PlaceholderElementType {
  type: ContentTypeEnum.PLACEHOLDER;
  placeholder: string;
  content: string;
  children: CustomTextType[];
}

export interface MaltekstElementType {
  type: UndeletableContentEnum.MALTEKST;
  section: TemplateSections;
  children: Descendant[];
}

export interface RegelverkElementType {
  type: UndeletableContentEnum.REGELVERK;
  children: [PageBreakElementType, MaltekstElementType, RegelverkContainerType];
}

export interface RegelverkContainerType {
  type: UndeletableContentEnum.REGELVERK_CONTAINER;
  children: Descendant[];
}

export type AlignableElementTypes = ParagraphElementType | BlockquoteElementType;

export type NonVoidElementTypes =
  | ParagraphElementType
  | IndentElementType
  | BlockquoteElementType
  | HeadingsType
  | ListsType
  | RedigerbareMalteksterElementType
  | PlaceholderElementType
  | MaltekstElementType
  | TableType
  | RegelverkElementType
  | RegelverkContainerType;

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
  indent: number;
}
export interface NumberedListElementType {
  type: ListTypesEnum.NUMBERED_LIST;
  children: ListItemElementType[];
  indent: number;
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

export interface TableCellElementType {
  type: TableContentEnum.TD;
  children: (ParagraphElementType | BulletListElementType | NumberedListElementType)[];
  colSpan: number;
}

export interface TableRowElementType {
  type: TableContentEnum.TR;
  children: TableCellElementType[];
}

export interface TableBodyElementType {
  type: TableContentEnum.TBODY;
  children: TableRowElementType[];
}

export interface TableElementType {
  type: TableTypeEnum.TABLE;
  children: TableBodyElementType[];
}

type TableType = TableElementType | TableBodyElementType | TableRowElementType | TableCellElementType;

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

export const hasAnyComments = (node: CustomTextType) => Object.keys(node).some((k) => k.startsWith(COMMENT_PREFIX));
