import { IVedlegg, MedunderskriverFlyt, Utfall } from './oppgave-state-types';

export interface IKlagebehandlingUtfallUpdate {
  klagebehandlingId: string;
  utfall: Utfall | null;
}

export interface IKlagebehandlingHjemlerUpdate {
  klagebehandlingId: string;
  hjemler: string[];
}

export interface ITilknyttDocumentParams extends IDocumentReference {
  klagebehandlingId: string;
}

export interface ITilknyttDocumentResponse {
  modified: string;
  file: IVedlegg;
}

export interface IDocumentReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface IVedtakFullfoertResponse {
  modified: string; // LocalDateTime;
  ferdigstilt: boolean;
}

export interface IFinishKlagebehandlingInput {
  klagebehandlingId: string;
}

export interface IMedunderskriver {
  navn: string;
  ident: string;
}

export interface IMedunderskrivereResponse {
  tema: string;
  medunderskrivere: IMedunderskriver[];
}

export interface IMedunderskrivereInput {
  id: string;
  tema: string;
}

export interface IMedunderskriverInfoResponse {
  medunderskriver: IMedunderskriverResponse | null;
  medunderskriverFlyt: MedunderskriverFlyt;
}

interface IMedunderskriverResponse {
  navident: string;
  navn: string;
}

export interface ISettMedunderskriverParams {
  klagebehandlingId: string;
  medunderskriver: IMedunderskriver | null;
}

export interface ISettMedunderskriverResponse {
  modified: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISwitchMedunderskriverflytParams {
  klagebehandlingId: string;
}
export interface ISwitchMedunderskriverflytResponse {
  modified: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface IUploadFileParams {
  klagebehandlingId: string;
  file: File;
}

export interface IUploadFileResponse {
  file: IVedlegg;
  modified: string;
}

export interface IDeleteFileParams {
  klagebehandlingId: string;
}
