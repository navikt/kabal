import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { HandlingEnum, IAddress } from '@app/types/documents/receivers';
import type { IOppgavebehandlingBaseParams } from '@app/types/oppgavebehandling/params';
import type { IDocumentParams } from './common-params';
import type { DistribusjonsType, IMottaker, UUID } from './documents';

export interface ISetParentParams extends IDocumentParams {
  parentId: UUID | null;
}

export interface ICreateVedleggParams extends IOppgavebehandlingBaseParams {
  parentId: UUID;
  journalfoerteDokumenter: IArkivertDocument[];
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
  identifikator: string | null;
  handling: HandlingEnum;
  overriddenAddress: IAddress | null;
  navn: string | null;
}

export interface ISetMottakerListParams extends IDocumentParams {
  mottakerList: IMottaker[];
}

export const mottakerToInputMottaker = (mottaker: IMottaker): InputMottaker => {
  const { part, handling, overriddenAddress } = mottaker;

  return {
    id: part.id,
    identifikator: part.identifikator,
    handling,
    overriddenAddress,
    navn: part.name,
  };
};
