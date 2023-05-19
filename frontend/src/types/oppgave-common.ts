import { SexEnum } from '@app/types/kodeverk';

export interface IDocumentReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface IVedlegg {
  name: string;
  size: number;
  opplastet: string | null; // LocalDateTime
}

export interface ISaksbehandler {
  navIdent: string;
  navn: string;
}

export interface IPartBase {
  id: string;
  name: string | null;
}

export enum IdType {
  FNR = 'FNR',
  ORGNR = 'ORGNR',
}

export interface IPart extends IPartBase {
  type: IdType;
}

export interface ISakenGjelder extends IPartBase {
  sex: SexEnum;
}
