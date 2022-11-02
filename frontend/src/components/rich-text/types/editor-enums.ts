export enum ContentTypeEnum {
  PARAGRAPH = 'paragraph',
  INDENT = 'indent',
  BLOCKQUOTE = 'blockquote',
  PLACEHOLDER = 'placeholder',
}

export enum UndeletableContentEnum {
  MALTEKST = 'maltekst',
}

export enum TableTypeEnum {
  TABLE = 'table',
}

export enum TableContentEnum {
  TBODY = 'tbody',
  TR = 'tr',
  TD = 'td',
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

export enum TextAlignEnum {
  TEXT_ALIGN_LEFT = 'text-align-left',
  TEXT_ALIGN_RIGHT = 'text-align-right',
  TEXT_ALIGN_CENTER = 'text-align-center',
  TEXT_ALIGN_JUSTIFY = 'text-align-justify',
}

export enum UndeletableVoidElementsEnum {
  SIGNATURE = 'signature',
  LABEL_CONTENT = 'label-content',
  DOCUMENT_LIST = 'document-list',
  CURRENT_DATE = 'current-date',
  PAGE_BREAK = 'page-break', // Undeletable with conventional methods (backspace etc.), but has special delete button
  HEADER = 'header',
  FOOTER = 'footer',
  EMPTY_VOID = 'empty-void',
}

export enum DeletableVoidElementsEnum {
  FLETTEFELT = 'flettefelt',
}

type VoidElementsEnum = UndeletableVoidElementsEnum | DeletableVoidElementsEnum;

export enum RedigerbarMaltekstEnum {
  REDIGERBAR_MALTEKST = 'redigerbar-maltekst',
  REGELVERKTEKST = 'regelverktekst',
}

export type NonVoidElementsEnum =
  | ContentTypeEnum
  | UndeletableContentEnum
  | HeadingTypesEnum
  | ListTypesEnum
  | ListContentEnum
  | RedigerbarMaltekstEnum
  | TableTypeEnum
  | TableContentEnum;

export type ElementTypesEnum = NonVoidElementsEnum | VoidElementsEnum;

export const AlignableTypeEnum = { ...ContentTypeEnum };
