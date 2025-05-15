import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_FULLMEKTIG,
  ELEMENT_HEADER,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SAKSNUMMER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { FULLMEKTIG_LABEL_PLACEHOLDER, FULLMEKTIG_VALUE_PLACEHOLDER } from '@app/plate/plugins/fullmektig';
import { LabelContentPlugin } from '@app/plate/plugins/label-content';
import { MaltekstPlugin } from '@app/plate/plugins/maltekst';
import {
  type BulletListElement,
  type CurrentDateElement,
  type EmptyVoidElement,
  type FooterElement,
  type FormattedText,
  type FullmektigElement,
  type H1Element,
  type H2Element,
  type HeaderElement,
  type LabelContentElement,
  type ListItemContainerElement,
  type ListItemElement,
  type MaltekstElement,
  type MaltekstseksjonElement,
  type PageBreakElement,
  type ParagraphElement,
  type ParentOrChildElement,
  type PlaceholderElement,
  type RedigerbarMaltekstElement,
  type RegelverkContainerElement,
  type RegelverkElement,
  type SignatureElement,
  type TableCellElement,
  type TableElement,
  type TableRowElement,
  TextAlign,
} from '@app/plate/types';
import { Language } from '@app/types/texts/language';
import { BaseParagraphPlugin } from '@udecode/plate-core';
import { HEADING_KEYS } from '@udecode/plate-heading';
import { BaseBulletedListPlugin, BaseListItemContentPlugin, BaseListItemPlugin } from '@udecode/plate-list';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@udecode/plate-table';
import { TemplateSections } from '../template-sections';
import { LabelContentSource } from '../types';

export const createLabelContent = (source: LabelContentSource): LabelContentElement => ({
  type: LabelContentPlugin.key,
  children: [{ text: '' }],
  source,
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
): MaltekstElement => ({ type: MaltekstPlugin.key, section, id, language, children });

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

export const createHeadingOne = (text: string): H1Element => ({
  type: HEADING_KEYS.h1,
  children: [{ text }],
});

export const createHeadingTwo = (text: string): H2Element => ({
  type: HEADING_KEYS.h2,
  children: [{ text }],
});

export const createSimpleParagraph = (text = ''): ParagraphElement => ({
  type: BaseParagraphPlugin.key,
  align: TextAlign.LEFT,
  children: [{ text }],
});

export const createSimpleListItemContainer = (text = ''): ListItemContainerElement => ({
  type: BaseListItemContentPlugin.key,
  children: [{ text }],
});

export const createSimpleListItem = (text = ''): ListItemElement => ({
  type: BaseListItemPlugin.key,
  children: [createSimpleListItemContainer(text)],
});

export const createSimpleBulletList = (...textItems: string[]): BulletListElement => ({
  type: BaseBulletedListPlugin.key,
  indent: 2,
  children: textItems.map(createSimpleListItem),
});

export const createSignature = (includeMedunderskriver = true, overriddenSaksbehandler?: string): SignatureElement => ({
  type: ELEMENT_SIGNATURE,
  enabled: true,
  useShortName: false,
  includeMedunderskriver,
  useSuffix: true,
  overriddenSaksbehandler,
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

export const createTableRow = (children = [createTableCell()]): TableRowElement => ({
  type: BaseTableRowPlugin.key,
  children,
});

export const createTableCell = (text = ''): TableCellElement => ({
  type: BaseTableCellPlugin.key,
  children: [createSimpleParagraph(text)],
  attributes: {},
});

export const createTable = (): TableElement => ({
  type: BaseTablePlugin.key,
  children: [
    createTableRow([createTableCell(), createTableCell()]),
    createTableRow([createTableCell(), createTableCell()]),
  ],
});

export const createPlaceHolder = (
  placeholder = '',
  deletable = true,
  children: FormattedText[] = [{ text: '' }],
): PlaceholderElement => ({
  type: ELEMENT_PLACEHOLDER,
  placeholder,
  children,
  deletable,
});

export const createEmptyVoid = (): EmptyVoidElement => ({
  type: ELEMENT_EMPTY_VOID,
  children: [{ text: '' }],
});

export const createFullmektig = (): FullmektigElement => ({
  type: ELEMENT_FULLMEKTIG,
  children: [
    { text: '' },
    createPlaceHolder(FULLMEKTIG_LABEL_PLACEHOLDER, false, [{ text: 'Fullmektig', bold: true }]),
    { text: '' },
    createPlaceHolder(FULLMEKTIG_VALUE_PLACEHOLDER, false),
    { text: '' },
  ],
  id: undefined,
  show: false,
});

export const createSaksinfo = () => [
  createLabelContent(LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
  createLabelContent(LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
  createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
  createLabelContent(LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
  createFullmektig(),
  {
    type: ELEMENT_SAKSNUMMER,
    children: [createPlaceHolder('Saksnummer', false)],
    isInitialized: false,
    deletable: false,
  },
];
