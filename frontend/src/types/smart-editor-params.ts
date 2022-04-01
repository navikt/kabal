import { Operation } from 'fast-json-patch';
import { Descendant } from 'slate';
import { IDocumentParams } from './documents-common-params';
import { IOppgavebehandlingBaseParams } from './oppgavebehandling-params';
import { Immutable } from './types';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  children: Descendant[];
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;

export type IGetSmartEditorParams = IDocumentParams;

export interface IUpdateSmartDocumentParams extends IGetSmartEditorParams {
  content: Descendant[];
}
export interface IPatchSmartDocumentParams extends IGetSmartEditorParams {
  patch: Operation[];
}
