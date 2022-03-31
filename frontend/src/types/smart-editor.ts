import { Descendant } from 'slate';
import { Immutable } from './types';

export interface INewSmartEditor {
  tittel: string; // ex. "Vedtak om klagebehandling 123".
  content: ISmartEditorElement[];
}

export interface ISmartEditor extends INewSmartEditor {
  id: string; // UUID from backend.
}

interface IMutableSmartEditorTemplate extends INewSmartEditor {
  templateId: string;
}

export type ISmartEditorTemplate = Immutable<IMutableSmartEditorTemplate>;

interface IBaseSmartEditorElement<T extends string, C = string | undefined> {
  id: string;
  type: T;
  content: C;
}

export type ISectionChildElement =
  | ISectionTitleElement
  | IRichTextElement
  | ITextElement
  | IStaticElement
  | ILabelContentElement
  | IDocumentListElement;

export type ISmartEditorElement = IDocumentTitleElement | ISectionElement | ISignatureElement;

export interface ISectionTitleElement extends IBaseSmartEditorElement<'section-title'> {
  source?: string;
}

export type ISectionElement = IBaseSmartEditorElement<'section', ISectionChildElement[]>;

export type IDocumentTitleElement = IBaseSmartEditorElement<'document-title', string>;

export type IRichTextElement = IBaseSmartEditorElement<'rich-text', Descendant[]>;

export interface ITextElement extends IBaseSmartEditorElement<'text'> {
  label: string;
}

export interface IStaticElement extends IBaseSmartEditorElement<'static', Descendant[] | undefined> {
  source: string;
}

export interface ILabelContentElement extends IBaseSmartEditorElement<'label-content'> {
  source: string;
  label: string;
}

export interface IDocumentItem {
  id: string;
  title: string;
  include: boolean;
}

export type IDocumentListElement = IBaseSmartEditorElement<'document-list', IDocumentItem[]>;

export interface ISignature {
  name: string;
  title: string;
}

export interface ISignatureContent {
  useShortName: boolean;
  saksbehandler?: ISignature;
  medunderskriver?: ISignature;
}

export type ISignatureElement = IBaseSmartEditorElement<'signature', ISignatureContent>;
