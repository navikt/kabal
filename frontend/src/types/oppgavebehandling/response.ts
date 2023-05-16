import { MedunderskriverFlyt } from '../kodeverk';
import { IMedunderskriver, IPerson, ISaksbehandler, IVedlegg } from '../oppgave-common';

export interface ITilknyttDocumentResponse {
  modified: string;
  file: IVedlegg;
}

export interface IVedtakFullfoertResponse {
  modified: string; // LocalDateTime;
  isAvsluttetAvSaksbehandler: boolean;
}

export interface IMedunderskrivereResponse {
  tema: string;
  medunderskrivere: IMedunderskriver[];
}

export interface IMedunderskriverResponse {
  medunderskriver: ISaksbehandler | null;
}

export interface ISaksbehandlerResponse {
  saksbehandler: ISaksbehandler | null;
}

export interface IMedunderskriverflytResponse {
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISettMedunderskriverResponse {
  modified: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISwitchMedunderskriverflytResponse {
  modified: string;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface IModifiedResponse {
  modified: string;
}

export interface ISakenGjelderResponse {
  sakenGjelder: IPerson;
}
