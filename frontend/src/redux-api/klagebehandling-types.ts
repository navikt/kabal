import {
  IDocumentReference,
  ISaksbehandler,
  IVedlegg,
  MedunderskriverFlyt,
  Utfall,
} from './klagebehandling-state-types';

export interface IKlagebehandlingUtfallUpdate {
  oppgaveId: string;
  utfall: Utfall | null;
}

export interface IKlagebehandlingHjemlerUpdate {
  oppgaveId: string;
  hjemler: string[];
}

export interface ITilknyttDocumentParams extends IDocumentReference {
  oppgaveId: string;
}

export interface ITilknyttDocumentResponse {
  modified: string;
  file: IVedlegg;
}

export interface IVedtakFullfoertResponse {
  modified: string; // LocalDateTime;
  isAvsluttetAvSaksbehandler: boolean;
}

export interface IFinishKlagebehandlingInput {
  oppgaveId: string;
}

export interface IMedunderskriver {
  navn: string;
  ident: string;
}

export interface IMedunderskrivereResponse {
  tema: string;
  medunderskrivere: IMedunderskriver[];
}

export interface IMedunderskrivereParams {
  navIdent: string;
  ytelseId: string;
  enhet: string;
}

export interface IMedunderskriverResponse {
  medunderskriver: ISaksbehandler | null;
}

export interface IMedunderskriverflytResponse {
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISettMedunderskriverParams {
  oppgaveId: string;
  medunderskriver: ISaksbehandler | null;
}

export interface ISettMedunderskriverResponse {
  modified: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISwitchMedunderskriverflytParams {
  oppgaveId: string;
}
export interface ISwitchMedunderskriverflytResponse {
  modified: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface IUploadFileParams {
  oppgaveId: string;
  file: File;
}

export interface IUploadFileResponse {
  file: IVedlegg;
  modified: string;
}

export interface IDeleteFileParams {
  oppgaveId: string;
}
