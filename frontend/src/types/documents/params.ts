import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { INavEmployee } from '../bruker';
import { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import { IDocumentParams } from './common-params';
import { CreatorRole, DistribusjonsType, UUID } from './documents';

export interface ISetParentParams extends IDocumentParams {
  parentId: UUID | null;
}

export interface ICreateVedleggFromJournalfoertDocumentParams extends IOppgavebehandlingBaseParams {
  parentId: UUID;
  journalfoerteDokumenter: IArkivertDocument[];
  creator: {
    employee: INavEmployee;
    creatorRole: CreatorRole.KABAL_SAKSBEHANDLING | CreatorRole.KABAL_ROL;
  };
  isFinished: boolean;
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
  parentId?: UUID;
}

interface IArchiveDocumentParams extends IDocumentParams {}

interface ISendDocumentParams extends IDocumentParams {
  brevmottakerIds: string[];
}

export type IFinishDocumentParams = IArchiveDocumentParams | ISendDocumentParams;

export type IGetVersionParams = IDocumentParams & { versionId: number };
