import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { MedunderskriverFlyt } from '../kodeverk';
import { INavEmployee, ISakenGjelder, IVedlegg } from '../oppgave-common';

export interface ITilknyttDocumentResponse extends IModifiedResponse {
  file: IVedlegg;
}

export interface IVedtakFullfoertResponse extends IModifiedResponse {
  isAvsluttetAvSaksbehandler: boolean;
}

export interface IMedunderskrivereResponse {
  tema: string;
  medunderskrivere: INavEmployee[];
}

export interface IMedunderskriverResponse {
  medunderskriver: INavEmployee | null;
}

export interface ISaksbehandlerResponse {
  saksbehandler: INavEmployee | null;
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
