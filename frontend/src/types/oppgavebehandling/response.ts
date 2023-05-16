import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { MedunderskriverFlyt } from '../kodeverk';
import { ISakenGjelder, ISaksbehandler, IVedlegg } from '../oppgave-common';

export interface ITilknyttDocumentResponse extends IModifiedResponse {
  file: IVedlegg;
}

export interface IVedtakFullfoertResponse extends IModifiedResponse {
  isAvsluttetAvSaksbehandler: boolean;
}

export interface IMedunderskrivereResponse {
  tema: string;
  medunderskrivere: ISaksbehandler[];
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

export interface ISettMedunderskriverResponse extends IModifiedResponse {
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISwitchMedunderskriverflytResponse extends IModifiedResponse {
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISetFeilregistrertResponse extends IModifiedResponse {
  feilregistrering: IFeilregistrering;
}

export interface IModifiedResponse {
  modified: string;
}

export interface ISakenGjelderResponse {
  sakenGjelder: ISakenGjelder;
}
