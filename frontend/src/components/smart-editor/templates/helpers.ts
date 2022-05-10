import { AddressSection, TemplateSections } from '../../../types/texts/texts';
import {
  ContentTypeEnum,
  HeadingTypesEnum,
  ListContentEnum,
  ListTypesEnum,
  RedigerbarMaltekstEnum,
  TextAlignEnum,
  UndeletableVoidElementsEnum,
} from '../../rich-text/types/editor-enums';
import {
  BulletListElementType,
  HeadingOneElementType,
  HeadingTwoElementType,
  ParagraphElementType,
  RedigerbareMalteksterElementType,
} from '../../rich-text/types/editor-types';
import {
  CurrentDateType,
  LabelContentElementType,
  PageBreakElementType,
  SignatureElementType,
  VoidElementTypes,
} from '../../rich-text/types/editor-void-types';

export const createLabelContent = (source: string, label: string): LabelContentElementType => ({
  type: UndeletableVoidElementsEnum.LABEL_CONTENT,
  children: [{ text: '' }],
  source,
  label,
  threadIds: [],
});

export const createMaltekst = (section: TemplateSections | AddressSection): VoidElementTypes => ({
  type: UndeletableVoidElementsEnum.MALTEKST,
  section,
  children: [{ text: '' }],
  content: null,
  threadIds: [],
});

export const createRedigerbarMaltekst = (section: TemplateSections): RedigerbareMalteksterElementType => ({
  type: RedigerbarMaltekstEnum.REDIGERBAR_MALTEKST,
  section,
  children: [createSimpleParagraph()],
});

export const createRegelverktekst = (section: TemplateSections): RedigerbareMalteksterElementType => ({
  type: RedigerbarMaltekstEnum.REGELVERKTEKST,
  section,
  children: [createSimpleParagraph()],
});

export const createHeadingOne = (text: string): HeadingOneElementType => ({
  type: HeadingTypesEnum.HEADING_ONE,
  children: [{ text }],
});

export const createHeadingTwo = (text: string): HeadingTwoElementType => ({
  type: HeadingTypesEnum.HEADING_TWO,
  children: [{ text }],
});

export const createSimpleParagraph = (text = ''): ParagraphElementType => ({
  type: ContentTypeEnum.PARAGRAPH,
  children: [{ text }],
  textAlign: TextAlignEnum.TEXT_ALIGN_LEFT,
});

export const createSimpleBulletList = (...textItems: string[]): BulletListElementType => ({
  type: ListTypesEnum.BULLET_LIST,
  children: textItems.map((text) => ({
    type: ListContentEnum.LIST_ITEM,
    children: [{ type: ListContentEnum.LIST_ITEM_CONTAINER, children: [{ text }] }],
  })),
});

export const createSignature = (): SignatureElementType => ({
  type: UndeletableVoidElementsEnum.SIGNATURE,
  useShortName: false,
  children: [{ text: '' }],
  threadIds: [],
});

export const createPageBreak = (): PageBreakElementType => ({
  type: UndeletableVoidElementsEnum.PAGE_BREAK,
  children: [{ text: '' }],
});

export const createCurrentDate = (): CurrentDateType => ({
  type: UndeletableVoidElementsEnum.CURRENT_DATE,
  children: [{ text: '' }],
});
