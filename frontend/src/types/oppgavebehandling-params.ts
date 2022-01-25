import { OppgaveType, Utfall } from './kodeverk';
import { IDocumentReference, ISaksbehandler } from './oppgave-common';

export interface IOppgavebehandlingBaseParams {
  oppgaveId: string;
  type: OppgaveType;
}

export interface IOppgavebehandlingUtfallUpdateParams extends IOppgavebehandlingBaseParams {
  utfall: Utfall | null;
}

export interface IOppgavebehandlingHjemlerUpdateParams extends IOppgavebehandlingBaseParams {
  hjemler: string[];
}

export interface IOppgavebehandlingFullfoertGosysUpdateParams extends IOppgavebehandlingBaseParams {
  type: OppgaveType.ANKEBEHANDLING;
}

export type ITilknyttDocumentParams = IDocumentReference & IOppgavebehandlingBaseParams;

export interface IMedunderskrivereParams {
  navIdent: string;
  ytelseId: string;
  enhet: string;
}

export interface ISetMedunderskriverParams extends IOppgavebehandlingBaseParams {
  medunderskriver: ISaksbehandler | null;
}

export interface IUploadFileParams extends IOppgavebehandlingBaseParams {
  file: File;
}

export interface IGetDokumenterParams extends IOppgavebehandlingBaseParams {
  pageReference: string | null;
  temaer: string[];
  pageSize: number;
}
