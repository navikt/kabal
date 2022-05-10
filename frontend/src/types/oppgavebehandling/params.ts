import { OppgaveType, Utfall } from '../kodeverk';
import { IDocumentReference, ISaksbehandler } from '../oppgave-common';
import { ISmartEditor } from '../smart-editor/smart-editor';

export interface IOppgavebehandlingBaseParams {
  oppgaveId: string;
}

export interface IMigrateSmartEditorsParams extends IOppgavebehandlingBaseParams {
  body: ISmartEditor[];
}

export interface IMottattKlageinstansParams extends IOppgavebehandlingBaseParams {
  mottattKlageinstans: string; // LocalDate
  type: OppgaveType.ANKE;
}

export interface IMottattVedtaksinstansParams extends IOppgavebehandlingBaseParams {
  mottattVedtaksinstans: string; // LocalDate
  type: OppgaveType.KLAGE;
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
