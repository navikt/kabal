import {
  AutoformatRule,
  DOMHandler,
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_LI,
  ELEMENT_LIC,
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
import {
  ELEMENT_CURRENT_DATE,
  ELEMENT_MALTEKST,
  ELEMENT_PAGE_BREAK,
  ELEMENT_PLACEHOLDER,
  ELEMENT_REDIGERBAR_MALTEKST,
  ELEMENT_REGELVERK,
  ELEMENT_REGELVERK_CONTAINER,
} from '@app/components/plate-editor/plugins/element-types';
import { TemplateSections } from '@app/types/texts/template-sections';

export enum TextAlign {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface RichText extends TText, TCommentText {
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

export interface BulletListElement extends BlockElement {
  type: typeof ELEMENT_UL;
  children: ListItemElement[];
}

export interface NumberedListElement extends BlockElement {
  type: typeof ELEMENT_OL;
  children: ListItemElement[];
}

export interface ListItemContainerElement extends BlockElement {
  type: typeof ELEMENT_LIC;
  children: RichText[];
}

export interface ListItemElement extends BlockElement {
  type: typeof ELEMENT_LI;
  children: [ListItemContainerElement, BulletListElement | NumberedListElement] | [ListItemContainerElement];
}

export interface TableElement extends TTableElement, BlockElement {
  type: typeof ELEMENT_TABLE;
  children: TableRowElement[];
}

export interface TableRowElement extends BlockElement {
  type: typeof ELEMENT_TR;
  children: TableCellElement[];
}

export interface TableCellElement extends BlockElement {
  type: typeof ELEMENT_TD;
  children: (ParagraphElement | BulletListElement | NumberedListElement)[];
}

export interface ParagraphElement extends BlockElement, IndentableStyleProps, AlignableStyleProps {
  type: typeof ELEMENT_PARAGRAPH;
  children: (RichText | PlaceholderElement)[];
}

interface BlockquoteElement extends BlockElement, IndentableStyleProps, AlignableStyleProps {
  type: typeof ELEMENT_BLOCKQUOTE;
  children: RichText[];
}

export interface MaltekstElement extends BlockElement {
  type: typeof ELEMENT_MALTEKST;
  section: TemplateSections;
  children: ParentOrChildElement[];
}

export interface RedigerbarMaltekstElement extends BlockElement {
  type: typeof ELEMENT_REDIGERBAR_MALTEKST;
  section: TemplateSections;
  children: ParentOrChildElement[];
}

export interface PlaceholderElement extends BlockElement {
  type: typeof ELEMENT_PLACEHOLDER;
  placeholder: string;
  // content: string; // TODO: Implement so BE can receive user input?
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

export interface RegelverkContainerElement extends BlockElement {
  type: typeof ELEMENT_REGELVERK_CONTAINER;
  children: ParentOrChildElement[];
}

export interface RegelverkElement extends BlockElement {
  type: typeof ELEMENT_REGELVERK;
  section: TemplateSections.REGELVERK;
  children: [PageBreakElement, MaltekstElement, RegelverkContainerElement];
}

export type ParentOrChildElement =
  | ParagraphElement
  | BlockquoteElement
  | H1Element
  | H2Element
  | H3Element
  | BulletListElement
  | NumberedListElement
  | TableElement;

type ParentOnlyElement =
  | MaltekstElement
  | RedigerbarMaltekstElement
  | RegelverkElement
  | CurrentDateElement
  | PageBreakElement;

export type RootElement = ParentOrChildElement | ParentOnlyElement;

export type ChildElement =
  | ListItemElement
  | ListItemContainerElement
  | TableRowElement
  | TableCellElement
  | RegelverkContainerElement
  | PlaceholderElement;

export type RichTextEditorElement = RootElement | ChildElement;

export type EditorDescendant = RichTextEditorElement | RichText;

export type EditorValue = RootElement[];

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
