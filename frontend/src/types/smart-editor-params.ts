import { IDocumentParams } from './documents-common-params';
import { IOppgavebehandlingBaseParams } from './oppgavebehandling-params';
import { ISmartEditorElement } from './smart-editor';
import { Immutable } from './types';

interface IMutableCreateSmartDocumentParams extends IOppgavebehandlingBaseParams {
  tittel: string;
  content: ISmartEditorElement[];
}

export type ICreateSmartDocumentParams = Immutable<IMutableCreateSmartDocumentParams>;

export interface IUpdateSmartDocumentParams extends IDocumentParams {
  content: ISmartEditorElement[];
}
