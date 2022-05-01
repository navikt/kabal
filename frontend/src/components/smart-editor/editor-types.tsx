import { BaseEditor, BaseRange, Descendant, Element, Node } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export enum ContentTypeEnum {
  PARAGRAPH = 'paragraph',
  BLOCKQUOTE = 'blockquote',
}

export enum ListTypesEnum {
  BULLET_LIST = 'bullet-list',
  NUMBERED_LIST = 'numbered-list',
}

export enum ListContentEnum {
  LIST_ITEM = 'list-item',
  LIST_ITEM_CONTAINER = 'list-item-container',
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
export const MarkableTypeEnum = { ...ContentTypeEnum, ...ListTypesEnum, ...ListContentEnum };

export enum TextAlignEnum {
  TEXT_ALIGN_LEFT = 'text-align-left',
  TEXT_ALIGN_RIGHT = 'text-align-right',
  TEXT_ALIGN_CENTER = 'text-align-center',
  TEXT_ALIGN_JUSTIFY = 'text-align-justify',
}

export enum VoidElementsEnum {
  SIGNATURE = 'signature',
  MALTEKST = 'maltekst',
  LABEL_CONTENT = 'label-content',
  DOCUMENT_LIST = 'document-list',
  CURRENT_DATE = 'current-date',
}

export const VOID_ELEMENT_TYPES = Object.values(VoidElementsEnum);

export const isVoid = (element: Element): element is VoidElementTypes =>
  VOID_ELEMENT_TYPES.some((t) => t === element.type);

export const isCommentableVoid = (element: Element): element is CommentableVoidElementTypes =>
  'threadIds' in element && Object.hasOwn(element, 'threadIds') && Array.isArray(element.threadIds);

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
export type CommentableVoidElementTypes =
  | SignatureElementType
  | LabelContentElementType
  | MaltekstElementType
  | DocumentListElementType;
export type VoidElementTypes = CommentableVoidElementTypes | CurrentDateType;

export type ElementTypes = ContentTypeEnum | HeadingTypesEnum | ListTypesEnum | ListContentEnum | VoidElementsEnum;

interface IWithThreads {
  threadIds: string[];
}

interface IBaseVoid {
  children: [CustomTextType];
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
export interface SignatureElementType extends ISignatureContent, IBaseVoid, IWithThreads {
  type: VoidElementsEnum.SIGNATURE;
}

export interface ISignature {
  name: string;
  title: string;
}

export interface ISignatureContent {
  useShortName: boolean;
  saksbehandler?: ISignature;
  medunderskriver?: ISignature;
}
export interface LabelContentElementType extends IBaseVoid, IWithThreads {
  type: VoidElementsEnum.LABEL_CONTENT;
  label: string;
  source: string;
  result?: string;
}

export interface MaltekstElementType extends IWithThreads {
  type: VoidElementsEnum.MALTEKST;
  source: string;
  maltekst: NonVoidElementTypes[] | null;
  children: Descendant[];
}

export interface IDocumentItem {
  id: string;
  title: string;
}

export interface DocumentListElementType extends IBaseVoid, IWithThreads {
  type: VoidElementsEnum.DOCUMENT_LIST;
  documents: IDocumentItem[];
}

export interface CurrentDateType extends IBaseVoid {
  type: VoidElementsEnum.CURRENT_DATE;
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

export type VoidsType =
  | SignatureElementType
  | MaltekstElementType
  | LabelContentElementType
  | DocumentListElementType
  | CurrentDateType;

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
    Element: ParagraphElementType | BlockquoteElementType | HeadingsType | ListsType | VoidsType;
    Text: CustomTextType;
    Range: CustomRange;
  }
}

export const isOfElementType = <T extends ParagraphElementType | HeadingsType | ListsType | VoidsType>(
  n: Node,
  type: ElementTypes
): n is T => Element.isElement(n) && n.type === type;

export const isOfElementTypes = <T extends ParagraphElementType | HeadingsType | ListsType | VoidsType>(
  n: Node,
  types: ElementTypes[]
): n is T => Element.isElement(n) && types.includes(n.type);

export const isNodeOfSameElementType = <T extends Element>(n: Node, element: T): n is T =>
  Element.isElement(n) && n.type === element.type;

export const isTypeAlignable = (
  type: HeadingTypesEnum | ListTypesEnum | ListContentEnum | ContentTypeEnum | VoidElementsEnum
): type is ContentTypeEnum => {
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
