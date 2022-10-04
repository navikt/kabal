import { Brevmottakertype } from '../kodeverk';
import { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import { IDocumentParams } from './common-params';
import { DocumentType, UUID } from './documents';

export interface ISetParentParams extends IDocumentParams {
  parentId: UUID | null;
}

export interface ISetTypeParams extends IDocumentParams {
  dokumentTypeId: DocumentType;
}

export interface ISetNameParams extends IDocumentParams {
  title: string;
}

export interface ICreateFileDocumentParams extends IOppgavebehandlingBaseParams {
  file: File;
}

export interface IFinishDocumentParams extends IDocumentParams {
  brevmottakertypeIds: Brevmottakertype[] | null;
}
