import { BaseH1Plugin, BaseH2Plugin } from '@platejs/basic-nodes';
import { BaseBulletedListPlugin, BaseListItemContentPlugin, BaseListItemPlugin } from '@platejs/list-classic';
import { BaseTableCellPlugin, BaseTablePlugin, BaseTableRowPlugin } from '@platejs/table';
import { BaseParagraphPlugin } from 'platejs';
import { FAGSYSTEM_ARENA } from '@/components/oppgavebehandling-footer/fagsystem';
import { FULLMEKTIG_LABEL_PLACEHOLDER, FULLMEKTIG_VALUE_PLACEHOLDER } from '@/plate/components/fullmektig';
import {
  ELEMENT_ARENA_SAKSNUMMER,
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FULLMEKTIG,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SAKSINFO,
  ELEMENT_SAKSNUMMER,
  ELEMENT_SIGNATURE,
} from '@/plate/plugins/element-types';
import { LabelContentPlugin } from '@/plate/plugins/label-content';
import { type DeprecatedTemplateSections, TemplateSections } from '@/plate/template-sections';
import { MAX_TABLE_WIDTH } from '@/plate/toolbar/table/constants';
import {
  type ArenaSaksnummerElement,
  type BulletListElement,
  type CurrentDateElement,
  type EmptyVoidElement,
  type FormattedText,
  type FullmektigElement,
  type H1Element,
  type H2Element,
  type LabelContentElement,
  LabelContentSource,
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
  type SaksinfoElement,
  type SaksnummerElement,
  type SignatureElement,
  type TableCellElement,
  type TableElement,
  type TableRowElement,
  TextAlign,
} from '@/plate/types';
import type { DistribusjonsType } from '@/types/documents/documents';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { TemplateIdEnum } from '@/types/smart-editor/template-enums';
import { Language } from '@/types/texts/language';

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

export const createHeadingOne = (text: string): H1Element => ({
  type: BaseH1Plugin.key,
  children: [{ text }],
});

export const createHeadingTwo = (text: string): H2Element => ({
  type: BaseH2Plugin.key,
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

export const createTableRow = (children = [createTableCell()]): TableRowElement => ({
  type: BaseTableRowPlugin.key,
  children,
});

export const createTableCell = (text = ''): TableCellElement => ({
  type: BaseTableCellPlugin.key,
  children: [createSimpleParagraph(text)],
  attributes: {},
});

export const createTable = (rows: number, columns: number): TableElement => ({
  type: BaseTablePlugin.key,
  children: Array.from({ length: rows }, () => createTableRow(Array.from({ length: columns }, createTableCell))),
  colSizes: Array.from({ length: columns }, () => Math.floor(MAX_TABLE_WIDTH / columns)),
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
    createPlaceHolder(FULLMEKTIG_LABEL_PLACEHOLDER, false, [{ text: 'Fullmektig' }]),
    { text: '' },
    createPlaceHolder(FULLMEKTIG_VALUE_PLACEHOLDER, false),
    { text: '' },
  ],
  id: undefined,
  show: false,
});

/** Parameters shared by every template factory, needed to tailor a template's content to the case it is created for. */
export interface CreateTemplateParams {
  sakstype: SaksTypeEnum;
  fagsystemId: string;
}

/**
 * The parts of a template that never depend on the case it is created for (unlike `richText`, which depends on
 * `CreateTemplateParams`). Every template file exports one of these and spreads it into its `deepFreeze(...)` call,
 * so admin/metadata consumers (e.g. `TEMPLATE_METADATA_MAP`) can read it directly without calling the template factory.
 */
export interface TemplateMetadata {
  templateId: TemplateIdEnum;
  tittel: string;
  dokumentTypeId: DistribusjonsType;
  deprecatedSections: DeprecatedTemplateSections[];
}

interface CreateSaksinfoParams extends CreateTemplateParams {
  children?: SaksinfoElement['children'];
}

export const createSaksinfo = ({
  sakstype,
  fagsystemId,
  children = [
    createLabelContent(LabelContentSource.KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME),
    createLabelContent(LabelContentSource.SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME),
    createLabelContent(LabelContentSource.SAKEN_GJELDER_FNR),
    createLabelContent(LabelContentSource.KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME),
    createFullmektig(),
    createSaksnummer(),
  ],
}: CreateSaksinfoParams): SaksinfoElement => ({
  type: ELEMENT_SAKSINFO,
  children: mayHaveArenaSaksnummer(sakstype, fagsystemId) ? [...children, createArenaSaksnummer()] : children,
});

// So-called "fake" cases: the case is really handled in Arena, but a corresponding case is created in Kabal
// to allow saksbehandlere to use Kabal's tools for producing documents etc. For these cases, the "Saksnummer"
// shown elsewhere in the document is Kabal's own (internal) reference, so we also show the actual Arena
// saksnummer to avoid confusion. See also `useIsFakeArenaCase`.
const SAKSTYPER_MED_ARENA_SAKSNUMMER: ReadonlySet<SaksTypeEnum> = new Set([
  SaksTypeEnum.KLAGE,
  SaksTypeEnum.ANKE,
  SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET,
  SaksTypeEnum.ANKE_I_TRYGDERETTEN,
]);

const mayHaveArenaSaksnummer = (sakstype: SaksTypeEnum, fagsystemId: string): boolean =>
  fagsystemId === FAGSYSTEM_ARENA && SAKSTYPER_MED_ARENA_SAKSNUMMER.has(sakstype);

export const createSaksnummer = (): SaksnummerElement => ({
  type: ELEMENT_SAKSNUMMER,
  children: [{ text: '' }, createPlaceHolder('Saksnummer', false), { text: '' }],
  isInitialized: false,
  deletable: false,
});

export const createArenaSaksnummer = (): ArenaSaksnummerElement => ({
  type: ELEMENT_ARENA_SAKSNUMMER,
  children: [{ text: '' }, createPlaceHolder('Saksnummer fra Arena', false), { text: '' }],
  isInitialized: false,
  deletable: false,
});
