import { DocumentType, UUID } from './documents';
import { IDocumentParams } from './documents-common-params';
import { IOppgavebehandlingBaseParams } from './oppgavebehandling-params';

export interface ISetParentParams extends IDocumentParams {
  parentId: UUID | null;
}

export interface ISetTypeParams extends IDocumentParams {
  dokumentTypeId: DocumentType;
}

export interface ISetNameParams extends IDocumentParams {
  title: string;
}

export interface ICreateFileDocument extends IOppgavebehandlingBaseParams {
  file: File;
}
