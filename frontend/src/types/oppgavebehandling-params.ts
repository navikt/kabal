import { Utfall } from './kodeverk';
import { IDocumentReference, ISaksbehandler } from './oppgave-common';

export interface IOppgavebehandlingBaseParams {
  oppgaveId: string;
}

export interface IOppgavebehandlingUtfallUpdateParams extends IOppgavebehandlingBaseParams {
  utfall: Utfall | null;
}

export interface IOppgavebehandlingHjemlerUpdateParams extends IOppgavebehandlingBaseParams {
  hjemler: string[];
}

export type ICheckDocumentParams = IDocumentReference &
  IOppgavebehandlingBaseParams & {
    pageReferences: (string | null)[];
    temaer: string[];
  };

export interface IMedunderskrivereParams {
  navIdent: string;
  ytelseId: string;
  enhet: string;
  fnr: string | null;
}

export interface ISetMedunderskriverParams extends IOppgavebehandlingBaseParams {
  medunderskriver: ISaksbehandler | null;
}

export interface IGetDokumenterParams extends IOppgavebehandlingBaseParams {
  pageReference: string | null;
  temaer: string[];
}
