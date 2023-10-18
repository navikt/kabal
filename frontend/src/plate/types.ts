/* eslint-disable max-lines */
/* eslint-disable import/no-unused-modules */
import { AutoformatRule } from '@udecode/plate-autoformat';
import {
  PlateEditor,
  PlateId,
  PlatePlugin,
  PluginOptions,
  TElement,
  TText,
  useEditorRef,
  useEditorState,
} from '@udecode/plate-common';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3 } from '@udecode/plate-heading';
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import {
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TR,
  TTableCellElement,
  TTableElement,
  TTableRowElement,
} from '@udecode/plate-table';
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_EMPTY_VOID,
  ELEMENT_FOOTER,
  ELEMENT_HEADER,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_MALTEKST,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
  ELEMENT_SIGNATURE,
} from '@app/plate/plugins/element-types';
import { TemplateSections } from './template-sections';

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface RichText extends TText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
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
  id?: PlateId;
}

/**
 * Blocks
 */

export interface ParagraphElement extends BlockElement, IndentableStyleProps, AlignableStyleProps {
  type: typeof ELEMENT_PARAGRAPH;
  children: (RichText | PlaceholderElement | LabelContentElement)[];
}

export interface H1Element extends BlockElement, IndentableStyleProps {
  type: typeof ELEMENT_H1;
  children: RichText[];
}

export interface H2Element extends BlockElement, IndentableStyleProps {
  type: typeof ELEMENT_H2;
  children: RichText[];
}

export interface H3Element extends BlockElement, IndentableStyleProps {
  type: typeof ELEMENT_H3;
  children: RichText[];
}

export interface BulletListElement extends BlockElement, IndentableStyleProps {
  type: typeof ELEMENT_UL;
  children: ListItemElement[];
}

export interface NumberedListElement extends BlockElement, IndentableStyleProps {
  type: typeof ELEMENT_OL;
  children: ListItemElement[];
}

export interface ListItemContainerElement extends BlockElement {
  type: typeof ELEMENT_LIC;
  children: RichText[];
}

export interface ListItemElement extends BlockElement {
  type: typeof ELEMENT_LI;
  // We have to ignore the sublist, as including it in the type causes TypeScript error ts2589 ("Type instantiation is excessively deep and possibly infinite").
  children: [ListItemContainerElement]; // | [ListItemContainerElement, BulletListElement | NumberedListElement];
}

export interface TableElement extends TTableElement, BlockElement, IndentableStyleProps {
  type: typeof ELEMENT_TABLE;
  children: TableRowElement[];
}

export interface TableRowElement extends BlockElement, TTableRowElement {
  type: typeof ELEMENT_TR;
  children: TableCellElement[];
}

export interface TableCellElement extends BlockElement, TTableCellElement {
  type: typeof ELEMENT_TD;
  children: (ParagraphElement | BulletListElement | NumberedListElement)[];
}

export interface MaltekstElement extends BlockElement {
  type: typeof ELEMENT_MALTEKST;
  section: TemplateSections;
  children: ParentOrChildElement[] | [EmptyVoidElement];
}

export interface RedigerbarMaltekstElement extends BlockElement {
  type: typeof ELEMENT_REDIGERBAR_MALTEKST;
  section: TemplateSections;
  textId?: string;
  children: ParentOrChildElement[] | [EmptyVoidElement];
}

export interface PlaceholderElement extends BlockElement {
  type: typeof ELEMENT_PLACEHOLDER;
  placeholder: string;
  children: RichText[];
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
}

export interface RegelverkElement extends BlockElement {
  type: typeof ELEMENT_REGELVERK;
  section: TemplateSections.REGELVERK_TITLE;
  children: [PageBreakElement, MaltekstElement, RegelverkContainerElement];
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
  label: string;
  source: string;
  result?: string;
}

export interface ISignature {
  name: string;
  title: string;
}

interface ISignatureContent {
  useShortName: boolean;
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
  | LabelContentElement;

type ParentOnlyElement =
  | MaltekstElement
  | RedigerbarMaltekstElement
  | RegelverkElement
  | CurrentDateElement
  | PageBreakElement
  | HeaderElement
  | FooterElement
  | SignatureElement;

export type RootElement = ParentOrChildElement | ParentOnlyElement;

export type ChildElement =
  | ListItemElement
  | ListItemContainerElement
  | TableRowElement
  | TableCellElement
  | RegelverkContainerElement
  | PlaceholderElement
  | EmptyVoidElement;

export type RichTextEditorElement = RootElement | ChildElement;

export type EditorDescendant = RichTextEditorElement | RichText | TText;

export type EditorValue = RootElement[];

/**
 * Editor types
 */

export type RichTextEditor = PlateEditor<EditorValue> & { isDragging?: boolean };

/**
 * Plate types
 */

export type EditorPlatePlugin<P = PluginOptions> = PlatePlugin<P>;

/**
 * Editor utils
 */

export type EditorAutoformatRule = AutoformatRule;

export const useMyPlateEditorRef = (id?: PlateId) => useEditorRef<EditorValue, RichTextEditor>(id);
export const useMyPlateEditorState = (id?: PlateId) => useEditorState<EditorValue, RichTextEditor>(id);
