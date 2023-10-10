import { UtfallEnum } from '@app/types/kodeverk';
import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { FlowState, IHelper, INavEmployee, INotSentHelper, ISakenGjelder, ISentHelper } from '../oppgave-common';

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

export type ISetMedunderskriverResponse = IModifiedResponse & (ISentHelper | INotSentHelper);

export type ISetRolResponse = IModifiedResponse & (ISentHelper | INotSentHelper);

export type ISetFlowStateResponse = IModifiedResponse & IHelper;

export interface ISetExtraUtfallResponse extends IModifiedResponse {
  extraUtfallIdSet: UtfallEnum[];
}

export interface ISetUtfallResponse extends ISetExtraUtfallResponse {
  utfallId: UtfallEnum | null;
}
