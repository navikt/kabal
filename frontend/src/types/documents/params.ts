import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { HandlingEnum, IAddress } from '@app/types/documents/recipients';
import { INavEmployee } from '../bruker';
import { IOppgavebehandlingBaseParams } from '../oppgavebehandling/params';
import { IDocumentParams } from './common-params';
import { CreatorRole, DistribusjonsType, IMottaker, UUID } from './documents';

export interface ISetParentParams extends IDocumentParams {
  parentId: UUID | null;
}

export interface ICreateVedleggParams extends IOppgavebehandlingBaseParams {
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

export type IFinishDocumentParams = IDocumentParams;

export type IGetVersionParams = IDocumentParams & { versionId: number };

interface InputMottaker {
  id: string;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
}

export interface ISetMottakerListParams extends IDocumentParams {
  mottakerList: IMottaker[];
}

export const mottakerToInputMottaker = (mottaker: IMottaker): InputMottaker => {
  const { part, handling, overriddenAddress } = mottaker;

  return {
    id: part.id,
    handling,
    overriddenAddress,
  };
};
