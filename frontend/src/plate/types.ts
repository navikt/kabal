import { BookmarkPlugin } from '@app/plate/plugins/bookmark';
import { CommentsPlugin } from '@app/plate/plugins/comments';
import type {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_FULLMEKTIG,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_MALTEKSTSEKSJON,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SAKSNUMMER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import type { IGetConsumerMaltekstseksjonerParams } from '@app/types/common-text-types';
import type { Language } from '@app/types/texts/language';
import type { CursorEditor, YjsEditor } from '@slate-yjs/core';
import type { BaseParagraphPlugin, TElement, TText } from '@udecode/plate';
import type { AutoformatRule } from '@udecode/plate-autoformat';
import { type PlateEditor, useEditorRef, useEditorState } from '@udecode/plate-core/react';
import type { HEADING_KEYS } from '@udecode/plate-heading';
import type {
  BaseBulletedListPlugin,
  BaseListItemContentPlugin,
  BaseListItemPlugin,
  BaseNumberedListPlugin,
} from '@udecode/plate-list';
import type {
  BaseTableCellPlugin,
  BaseTablePlugin,
  BaseTableRowPlugin,
  TTableCellElement,
  TTableElement,
  TTableRowElement,
} from '@udecode/plate-table';
import type { PlateYjsEditorProps } from '@udecode/plate-yjs';
import type { TemplateSections } from './template-sections';

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface FormattedText extends TText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  autoCapitalised?: boolean;
  abbreviation?: string;
  [CommentsPlugin.key]?: boolean;
  [BookmarkPlugin.key]?: boolean;
}

/**
 * Block props
 */
interface AlignableStyleProps {
  align: TextAlign;
}

export interface IndentableStyleProps {
  indent?: number;
}

interface BlockElement extends TElement {
  id?: string;
}

/**
 * Blocks
 */

export interface ParagraphElement extends BlockElement, IndentableStyleProps, AlignableStyleProps {
  type: typeof BaseParagraphPlugin.key;
  children: (FormattedText | PlaceholderElement | LabelContentElement | FullmektigElement)[];
}

export interface H1Element extends BlockElement, IndentableStyleProps {
  type: typeof HEADING_KEYS.h1;
  children: (FormattedText | PlaceholderElement)[];
}

export interface H2Element extends BlockElement, IndentableStyleProps {
  type: typeof HEADING_KEYS.h2;
  children: (FormattedText | PlaceholderElement)[];
}

export interface H3Element extends BlockElement, IndentableStyleProps {
  type: typeof HEADING_KEYS.h3;
  children: (FormattedText | PlaceholderElement)[];
}

export interface BulletListElement extends BlockElement, IndentableStyleProps {
  type: typeof BaseBulletedListPlugin.key;
  children: ListItemElement[];
}

export interface NumberedListElement extends BlockElement, IndentableStyleProps {
  type: typeof BaseNumberedListPlugin.key;
  children: ListItemElement[];
}

export interface ListItemContainerElement extends BlockElement {
  type: typeof BaseListItemContentPlugin.key;
  children: (FormattedText | PlaceholderElement)[];
}

export interface ListItemElement extends BlockElement {
  type: typeof BaseListItemPlugin.key;
  // We have to ignore the sublist, as including it in the type causes TypeScript error ts2589 ("Type instantiation is excessively deep and possibly infinite").
  children: [ListItemContainerElement]; // | [ListItemContainerElement, BulletListElement | NumberedListElement];
}

export interface TableElement extends TTableElement, BlockElement, IndentableStyleProps {
  type: typeof BaseTablePlugin.key;
  children: TableRowElement[];
}

export interface TableRowElement extends BlockElement, TTableRowElement {
  type: typeof BaseTableRowPlugin.key;
  children: TableCellElement[];
}

export interface TableCellElement extends BlockElement, TTableCellElement {
  type: typeof BaseTableCellPlugin.key;
  children: (ParagraphElement | BulletListElement | NumberedListElement)[];
}

export interface MaltekstElement extends BlockElement {
  type: typeof ELEMENT_MALTEKST;
  id?: string;
  language?: Language;
  section: TemplateSections;
  children: ParentOrChildElement[] | [EmptyVoidElement];
}

export interface RedigerbarMaltekstElement extends BlockElement {
  type: typeof ELEMENT_REDIGERBAR_MALTEKST;
  id?: string;
  language?: Language;
  section: TemplateSections;
  children: ParentOrChildElement[] | [EmptyVoidElement];
}

export interface MaltekstseksjonElement extends BlockElement {
  type: typeof ELEMENT_MALTEKSTSEKSJON;
  id?: string;
  section: TemplateSections;
  textIdList: string[];
  children: (MaltekstElement | RedigerbarMaltekstElement)[] | [EmptyVoidElement];
  query?: IGetConsumerMaltekstseksjonerParams;
  language?: Language;
}

export interface PlaceholderElement extends BlockElement {
  type: typeof ELEMENT_PLACEHOLDER;
  placeholder: string;
  children: FormattedText[];
  deletable?: boolean;
}

export interface PageBreakElement extends BlockElement {
  type: typeof ELEMENT_PAGE_BREAK;
  children: [{ text: '' }];
}

export interface CurrentDateElement extends BlockElement {
  type: typeof ELEMENT_CURRENT_DATE;
  children: [{ text: '' }];
}

export interface EmptyVoidElement extends BlockElement {
  type: typeof ELEMENT_EMPTY_VOID;
  children: [{ text: '' }];
}

export interface RegelverkContainerElement extends BlockElement {
  type: typeof ELEMENT_REGELVERK_CONTAINER;
  children: ParentOrChildElement[];
  query?: RegelverkQuery;
}

export interface RegelverkQuery {
  ytelseHjemmelIdList?: string[];
  utfallIdList?: string;
}

export interface RegelverkElement extends BlockElement {
  type: typeof ELEMENT_REGELVERK;
  section: TemplateSections.REGELVERK_TITLE;
  children: [PageBreakElement, MaltekstseksjonElement, RegelverkContainerElement];
}

export interface HeaderElement extends TElement {
  type: typeof ELEMENT_HEADER;
  content: string | null;
  children: [{ text: '' }];
}

export interface FooterElement extends TElement {
  type: typeof ELEMENT_FOOTER;
  content: string | null;
  children: [{ text: '' }];
}

export interface LabelContentElement extends TElement {
  type: typeof ELEMENT_LABEL_CONTENT;
  children: [{ text: '' }];
  label?: string;
  source: LabelContentSource;
  result?: string;
}

export interface FullmektigElement extends TElement {
  type: typeof ELEMENT_FULLMEKTIG;
  // One would think [PlaceholderElement, PlaceholderElement] would work, but Slate/Plate insists on inserting surrounding text nodes. At least now the type will be correct.
  children: [{ text: '' }, PlaceholderElement, { text: '' }, PlaceholderElement, { text: '' }];
  id: string | undefined;
  show: boolean;
}

export interface SaksnummerElement extends TElement {
  type: typeof ELEMENT_SAKSNUMMER;
  // One would think [PlaceholderElement] would work, but Slate/Plate insists on inserting surrounding text nodes. At least now the type will be correct.
  children: [{ text: '' }, PlaceholderElement, { text: '' }];
  isInitialized: boolean;
}

export interface ISignature {
  name: string;
  title?: string;
}

interface ISignatureContent {
  enabled?: boolean;
  useShortName: boolean;
  useSuffix: boolean;
  includeMedunderskriver: boolean;
  overriddenSaksbehandler?: string;
  saksbehandler?: ISignature;
  medunderskriver?: ISignature;
}

export interface SignatureElement extends ISignatureContent, TElement {
  type: typeof ELEMENT_SIGNATURE;
}

export type ParentOrChildElement =
  | ParagraphElement
  | H1Element
  | H2Element
  | H3Element
  | BulletListElement
  | NumberedListElement
  | TableElement
  | LabelContentElement
  | EmptyVoidElement;

type ParentOnlyElement =
  | MaltekstElement
  | RedigerbarMaltekstElement
  | RegelverkElement
  | CurrentDateElement
  | PageBreakElement
  | HeaderElement
  | FooterElement
  | SignatureElement
  | MaltekstseksjonElement
  | SaksnummerElement;

export type RootElement = ParentOrChildElement | ParentOnlyElement;

export type KabalValue = RootElement[];

export type ChildElement =
  | ListItemElement
  | ListItemContainerElement
  | TableRowElement
  | TableCellElement
  | RegelverkContainerElement
  | PlaceholderElement
  | FullmektigElement;

export type RichTextEditorElement = RootElement | ChildElement;

export type EditorDescendant = RichTextEditorElement | FormattedText;

/**
 * Editor types
 */

export type RichTextEditor = PlateEditor & { isDragging?: boolean; children: KabalValue };

/**
 * Editor utils
 */

export type EditorAutoformatRule = AutoformatRule;

export const useMyPlateEditorRef = (id?: string) =>
  useEditorRef<RichTextEditor & CursorEditor & YjsEditor & PlateYjsEditorProps>(id);
export const useMyPlateEditorState = (id?: string) =>
  useEditorState<RichTextEditor & CursorEditor & YjsEditor & PlateYjsEditorProps>(id);

export enum LabelContentSource {
  YTELSE = 'ytelse',
  SAKEN_GJELDER_NAME = 'sakenGjelder.name',
  SAKEN_GJELDER_FNR = 'sakenGjelder.fnr',
  SAKSNUMMER = 'saksnummer',
  SAKEN_GJELDER_IF_DIFFERENT_FROM_KLAGER_NAME = 'sakenGjelderIfDifferentFromKlager.name',
  KLAGER_IF_EQUAL_TO_SAKEN_GJELDER_NAME = 'klagerIfEqualToSakenGjelder.name',
  KLAGER_IF_DIFFERENT_FROM_SAKEN_GJELDER_NAME = 'klagerIfDifferentFromSakenGjelder.name',
  ANKEMOTPART = 'ankemotpart',
}
