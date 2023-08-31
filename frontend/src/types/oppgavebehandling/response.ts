import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { FlowState, IHelper, INavEmployee, ISakenGjelder } from '../oppgave-common';

export type ITilknyttDocumentResponse = IModifiedResponse;

export interface IVedtakFullfoertResponse extends IModifiedResponse {
  isAvsluttetAvSaksbehandler: boolean;
}

export interface IMedunderskrivereResponse {
  tema: string;
  medunderskrivere: INavEmployee[];
}

export interface IMedunderskriverResponse {
  modified: string;
  navIdent: string | null;
  flowState: FlowState;
}

export interface IRolResponse {
  modified: string;
  navIdent: string | null;
  flowState: FlowState;
}

export interface ISaksbehandlerResponse {
  saksbehandler: INavEmployee | null;
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

export interface ISetMedunderskriverResponse extends IModifiedResponse, IHelper {}

export interface ISetRolResponse extends IModifiedResponse, IHelper {}
export interface ISetFlowStateResponse extends IModifiedResponse, IHelper {}
