import {
  AutoformatRule,
  DOMHandler,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LI,
  ELEMENT_OL,
  ELEMENT_PARAGRAPH,
  ELEMENT_TABLE,
  ELEMENT_TD,
  ELEMENT_TR,
  ELEMENT_UL,
  InjectComponent,
  InjectProps,
  KeyboardHandler,
  OnChange,
  OverrideByKey,
  PlateEditor,
  PlateId,
  PlatePlugin,
  PlatePluginInsertData,
  PlatePluginProps,
  PlateProps,
  PluginOptions,
  TCommentText,
  TElement,
  TTableElement,
  TText,
  WithOverride,
  usePlateEditorRef,
} from '@udecode/plate';
import { ELEMENT_MALTEKST } from '@app/components/plate-editor/plugins/maltekst';
import { ELEMENT_PLACEHOLDER } from '@app/components/plate-editor/plugins/placeholder';
import { ELEMENT_REDIGERBAR_MALTEKST } from '@app/components/plate-editor/plugins/redigerbar-maltekst';
import { ELEMENT_REGELVERK, ELEMENT_REGELVERK_CONTAINER } from '@app/components/plate-editor/plugins/regelverk';
import { TemplateSections } from '@app/types/texts/texts';
import { ELEMENT_CURRENT_DATE } from './plugins/current-date';
import { ELEMENT_PAGE_BREAK } from './plugins/page-break';

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface RichText extends TText, TCommentText {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface Leaf extends TText {
  text: string;
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

export interface H1Element extends BlockElement {
  type: typeof ELEMENT_H1;
  children: RichText[];
}

export interface H2Element extends BlockElement {
  type: typeof ELEMENT_H2;
  children: RichText[];
}

export interface H3Element extends BlockElement {
  type: typeof ELEMENT_H3;
  children: RichText[];
}

export interface BulletListElement extends TElement, BlockElement {
  type: typeof ELEMENT_UL;
  children: ListItemElement[];
}

export interface NumberedListElement extends TElement, BlockElement {
  type: typeof ELEMENT_OL;
  children: ListItemElement[];
}

export interface ListItemElement extends TElement, BlockElement {
  type: typeof ELEMENT_LI;
  children: RichText[];
}

export interface TableElement extends TTableElement, BlockElement {
  type: typeof ELEMENT_TABLE;
  children: TableRowElement[];
}

export interface TableRowElement extends TElement {
  type: typeof ELEMENT_TR;
  children: TableCellElement[];
}

interface TableCellElement extends TElement {
  type: typeof ELEMENT_TD;
  children: (ParagraphElement | BulletListElement | NumberedListElement)[];
}

export interface ParagraphElement extends BlockElement, IndentableStyleProps, AlignableStyleProps {
  type: typeof ELEMENT_PARAGRAPH;
  children: (RichText | Leaf | PlaceholderElement)[];
}

export interface MaltekstElement extends TElement {
  type: typeof ELEMENT_MALTEKST;
  section: TemplateSections;
}

export interface RedigerbarMaltekstElement extends TElement {
  type: typeof ELEMENT_REDIGERBAR_MALTEKST;
  section: TemplateSections;
  children: TopLevelElements[];
}

export interface PlaceholderElement extends TElement {
  type: typeof ELEMENT_PLACEHOLDER;
  placeholder: string;
  children: (RichText | Leaf)[];
}

export interface PageBreakElement extends TElement {
  type: typeof ELEMENT_PAGE_BREAK;
}

export interface CurrentDateElement extends TElement {
  type: typeof ELEMENT_CURRENT_DATE;
  children: Leaf[];
}

export interface RegelverkContainerElement extends TElement {
  type: typeof ELEMENT_REGELVERK_CONTAINER;
  children: TopLevelElements[];
}

export interface RegelverkElement extends TElement {
  type: typeof ELEMENT_REGELVERK;
  section: TemplateSections.REGELVERK;
  children: [PageBreakElement, MaltekstElement, RegelverkContainerElement];
}

export type TopLevelElements =
  | ParagraphElement
  | H1Element
  | H2Element
  | H3Element
  | BulletListElement
  | NumberedListElement
  | TableElement
  | PageBreakElement
  | CurrentDateElement;

export type RootBlock = TopLevelElements | MaltekstElement | RedigerbarMaltekstElement | RegelverkElement;

export type RichTextEditorElements = RootBlock | ListItemElement | TableCellElement | TElement | TText;

export type EditorValue = RootBlock[];

/**
 * Editor types
 */

export type RichTextEditor = PlateEditor<EditorValue> & { isDragging?: boolean };

/**
 * Plate types
 */

type EditorDOMHandler<P = PluginOptions> = DOMHandler<P, EditorValue, RichTextEditor>;
type EditorInjectComponent = InjectComponent<EditorValue>;
type EditorInjectProps = InjectProps<EditorValue>;
type EditorKeyboardHandler<P = PluginOptions> = KeyboardHandler<P, EditorValue, RichTextEditor>;
type EditorOnChange<P = PluginOptions> = OnChange<P, EditorValue, RichTextEditor>;
type EditorOverrideByKey = OverrideByKey<EditorValue, RichTextEditor>;
export type EditorPlatePlugin<P = PluginOptions> = PlatePlugin<P, EditorValue, RichTextEditor>;
type EditorPlatePluginInsertData = PlatePluginInsertData<EditorValue>;
type EditorPlatePluginProps = PlatePluginProps<EditorValue>;
type EditorPlateProps = PlateProps<EditorValue, RichTextEditor>;
type EditorWithOverride<P = PluginOptions> = WithOverride<P, EditorValue, RichTextEditor>;

/**
 * Editor utils
 */

export type EditorAutoformatRule = AutoformatRule<EditorValue, RichTextEditor>;

export const useMyPlateEditorRef = (id?: PlateId) => usePlateEditorRef<EditorValue, RichTextEditor>(id);
