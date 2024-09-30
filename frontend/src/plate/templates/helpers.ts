import { ELEMENT_H1, ELEMENT_H2 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import {
  BulletListElement,
  CurrentDateElement,
  EmptyVoidElement,
  FooterElement,
  H1Element,
  H2Element,
  HeaderElement,
  LabelContentElement,
  ListItemContainerElement,
  ListItemElement,
  MaltekstElement,
  MaltekstseksjonElement,
  PageBreakElement,
  ParagraphElement,
  ParentOrChildElement,
  PlaceholderElement,
  RedigerbarMaltekstElement,
  RegelverkContainerElement,
  RegelverkElement,
  SignatureElement,
  TableCellElement,
  TableElement,
  TableRowElement,
  TextAlign,
} from '@app/plate/types';
import { Language } from '@app/types/texts/language';
import { TemplateSections } from '../template-sections';

export const createLabelContent = (source: string, label: string): LabelContentElement => ({
  type: ELEMENT_LABEL_CONTENT,
  children: [{ text: '' }],
  source,
  label,
  threadIds: [],
});

export const createMaltekstseksjon = (
  section: TemplateSections,
  id?: string,
  textIdList: string[] = [],
  children: MaltekstseksjonElement['children'] = [createEmptyVoid()],
  language: Language = Language.NB,
): MaltekstseksjonElement => ({
  type: ELEMENT_MALTEKSTSEKSJON,
  id,
  section,
  children,
  textIdList,
  language,
  query: undefined,
});

export const createMaltekst = (
  section: TemplateSections,
  children: ParentOrChildElement[] = [createSimpleParagraph()],
  id?: string,
  language: Language = Language.NB,
): MaltekstElement => ({ type: ELEMENT_MALTEKST, section, id, language, children });

export const createRedigerbarMaltekst = (
  section: TemplateSections,
  children?: ParentOrChildElement[],
  id?: string,
  language: Language = Language.NB,
): RedigerbarMaltekstElement => ({
  type: ELEMENT_REDIGERBAR_MALTEKST,
  section,
  id,
  language,
  // Avoid using same reference for same redigerbar maltekst used different places
  children: children === undefined ? [createEmptyVoid()] : structuredClone(children),
});

export const createRegelverkContainer = (
  children: ParentOrChildElement[] = [createSimpleParagraph()],
): RegelverkContainerElement => ({
  type: ELEMENT_REGELVERK_CONTAINER,
  children,
});

export const createRegelverk = (): RegelverkElement => ({
  type: ELEMENT_REGELVERK,
  section: TemplateSections.REGELVERK_TITLE,
  children: [createPageBreak(), createMaltekstseksjon(TemplateSections.REGELVERK_TITLE), createRegelverkContainer()],
});

// eslint-disable-next-line import/no-unused-modules
export const createHeadingOne = (text: string): H1Element => ({
  type: ELEMENT_H1,
  children: [{ text }],
});

// eslint-disable-next-line import/no-unused-modules
export const createHeadingTwo = (text: string): H2Element => ({
  type: ELEMENT_H2,
  children: [{ text }],
});

export const createSimpleParagraph = (text = ''): ParagraphElement => ({
  type: ELEMENT_PARAGRAPH,
  align: TextAlign.LEFT,
  children: [{ text }],
});

export const createSimpleListItemContainer = (text = ''): ListItemContainerElement => ({
  type: ELEMENT_LIC,
  children: [{ text }],
});

export const createSimpleListItem = (text = ''): ListItemElement => ({
  type: ELEMENT_LI,
  children: [createSimpleListItemContainer(text)],
});

// eslint-disable-next-line import/no-unused-modules
export const createSimpleBulletList = (...textItems: string[]): BulletListElement => ({
  type: ELEMENT_UL,
  indent: 2,
  children: textItems.map(createSimpleListItem),
});

export const createSignature = (): SignatureElement => ({
  type: ELEMENT_SIGNATURE,
  useShortName: false,
  includeMedunderskriver: true,
  useSuffix: true,
  children: [{ text: '' }],
  threadIds: [],
});

export const createPageBreak = (): PageBreakElement => ({
  type: ELEMENT_PAGE_BREAK,
  children: [{ text: '' }],
});

export const createCurrentDate = (): CurrentDateElement => ({
  type: ELEMENT_CURRENT_DATE,
  children: [{ text: '' }],
});

export const createHeader = (): HeaderElement => ({
  type: ELEMENT_HEADER,
  children: [{ text: '' }],
  threadIds: [],
  content: null,
});

export const createFooter = (): FooterElement => ({
  type: ELEMENT_FOOTER,
  children: [{ text: '' }],
  threadIds: [],
  content: null,
});

export const createTableRow = (children = [createTableCell()]): TableRowElement => ({ type: ELEMENT_TR, children });

export const createTableCell = (text = ''): TableCellElement => ({
  type: ELEMENT_TD,
  children: [createSimpleParagraph(text)],
  attributes: {},
});

export const createTable = (): TableElement => ({
  type: ELEMENT_TABLE,
  children: [
    createTableRow([createTableCell(), createTableCell()]),
    createTableRow([createTableCell(), createTableCell()]),
  ],
});

export const createPlaceHolder = (placeholder = ''): PlaceholderElement => ({
  type: ELEMENT_PLACEHOLDER,
  placeholder,
  children: [{ text: '' }],
});

export const createEmptyVoid = (): EmptyVoidElement => ({
  type: ELEMENT_EMPTY_VOID,
  children: [{ text: '' }],
});
