import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { MedunderskriverFlyt } from '../kodeverk';
import { INavEmployee, ISakenGjelder } from '../oppgave-common';

export type ITilknyttDocumentResponse = IModifiedResponse;

export interface IVedtakFullfoertResponse extends IModifiedResponse {
  isAvsluttetAvSaksbehandler: boolean;
}

export interface IMedunderskrivereResponse {
  tema: string;
  medunderskrivere: INavEmployee[];
}

export interface ISaksbehandlerResponse {
  saksbehandler: INavEmployee | null;
}

export interface ISettMedunderskriverResponse extends IModifiedResponse {
  medunderskriver: INavEmployee | null;
  medunderskriverFlyt: MedunderskriverFlyt;
}

export interface ISwitchMedunderskriverflytResponse extends IModifiedResponse, INavEmployee {
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
