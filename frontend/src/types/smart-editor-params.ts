import { Descendant } from 'slate';
import { IDocumentParams } from './documents-common-params';
import { IOppgavebehandlingBaseParams } from './oppgavebehandling-params';

export interface ICreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: ISmartEditorElement[];
}

export interface IUpdateSmartDocumentParams extends IDocumentParams {
  content: ISmartEditorElement[];
}

interface IBaseSmartEditorElement {
  id: string;
  label: string; // ex. "Vedtak / Beslutning".
}

export type ISmartEditorElement = IRichTextElement | ITextElement;

export interface IRichTextElement extends IBaseSmartEditorElement {
  type: 'rich-text';
  content: Descendant[];
}

export interface ITextElement extends IBaseSmartEditorElement {
  type: 'text';
  content: string;
}
