import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { Brevmottakertype } from '../kodeverk';
import { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import { IDocumentParams } from './common-params';
import { DistribusjonsType, UUID } from './documents';

export interface ISetParentParams extends IDocumentParams {
  parentId: UUID | null;
}

export interface ICreateVedleggFromJournalfoertDocumentParams extends IOppgavebehandlingBaseParams {
  parentId: UUID;
  journalfoerteDokumenter: IArkivertDocument[];
}

export interface ISetTypeParams extends IDocumentParams {
  dokumentTypeId: DistribusjonsType;
}

export interface ISetNameParams extends IDocumentParams {
  title: string;
}

export interface ICreateFileDocumentParams extends IOppgavebehandlingBaseParams {
  file: File;
  dokumentTypeId: DistribusjonsType;
}

export interface IFinishDocumentParams extends IDocumentParams {
  brevmottakertypeIds: Brevmottakertype[] | null;
}
