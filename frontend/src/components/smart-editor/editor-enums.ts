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
  LABEL_CONTENT = 'label-content',
  DOCUMENT_LIST = 'document-list',
  CURRENT_DATE = 'current-date',
}

export type NonVoidElementsEnum = ContentTypeEnum | HeadingTypesEnum | ListTypesEnum | ListContentEnum;
export type ElementTypesEnum = NonVoidElementsEnum | VoidElementsEnum;
