import { CurrentDatePlugin } from '@app/plate/plugins/current-date';
import { EmptyVoidPlugin } from '@app/plate/plugins/empty-void';
import { FooterPlugin, HeaderPlugin } from '@app/plate/plugins/header-footer';
import { LabelContentPlugin } from '@app/plate/plugins/label-content';
import { MaltekstPlugin } from '@app/plate/plugins/maltekst';
import { MaltekstseksjonPlugin } from '@app/plate/plugins/maltekstseksjon';
import { PageBreakPlugin } from '@app/plate/plugins/page-break';
import { SaksbehandlerPlaceholderPlugin } from '@app/plate/plugins/placeholder/saksbehandler';
import { RedigerbarMaltekstPlugin } from '@app/plate/plugins/redigerbar-maltekst';
import { RegelverkContainerPlugin, RegelverkPlugin } from '@app/plate/plugins/regelverk';
import { SignaturePlugin } from '@app/plate/plugins/signature';
import {
  type BulletListElement,
  type CurrentDateElement,
  type EmptyVoidElement,
  type FooterElement,
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

export const createLabelContent = (source: string, label: string): LabelContentElement => ({
  type: LabelContentPlugin.key,
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
  type: MaltekstseksjonPlugin.key,
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
  type: RedigerbarMaltekstPlugin.key,
  section,
  id,
  language,
  // Avoid using same reference for same redigerbar maltekst used different places
  children: children === undefined ? [createEmptyVoid()] : structuredClone(children),
});

export const createRegelverkContainer = (
  children: ParentOrChildElement[] = [createSimpleParagraph()],
): RegelverkContainerElement => ({
  type: RegelverkContainerPlugin.key,
  children,
});

export const createRegelverk = (): RegelverkElement => ({
  type: RegelverkPlugin.key,
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

export const createSignature = (): SignatureElement => ({
  type: SignaturePlugin.key,
  useShortName: false,
  includeMedunderskriver: true,
  useSuffix: true,
  children: [{ text: '' }],
  threadIds: [],
});

export const createPageBreak = (): PageBreakElement => ({
  type: PageBreakPlugin.key,
  children: [{ text: '' }],
});

export const createCurrentDate = (): CurrentDateElement => ({
  type: CurrentDatePlugin.key,
  children: [{ text: '' }],
});

export const createHeader = (): HeaderElement => ({
  type: HeaderPlugin.key,
  children: [{ text: '' }],
  threadIds: [],
  content: null,
});

export const createFooter = (): FooterElement => ({
  type: FooterPlugin.key,
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

export const createPlaceHolder = (placeholder = ''): PlaceholderElement => ({
  type: SaksbehandlerPlaceholderPlugin.key,
  placeholder,
  children: [{ text: '' }],
});

export const createEmptyVoid = (): EmptyVoidElement => ({
  type: EmptyVoidPlugin.key,
  children: [{ text: '' }],
});
