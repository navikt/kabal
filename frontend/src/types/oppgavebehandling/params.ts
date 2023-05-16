import { SaksTypeEnum, UtfallEnum } from '../kodeverk';
import { IDocumentReference, IPart, ISaksbehandler } from '../oppgave-common';
import { ISmartEditor } from '../smart-editor/smart-editor';

export interface IOppgavebehandlingBaseParams {
  oppgaveId: string;
}

export interface IMigrateSmartEditorsParams extends IOppgavebehandlingBaseParams {
  body: ISmartEditor[];
}

export interface IFristParams extends IOppgavebehandlingBaseParams {
  date: string; // LocalDate
}

export interface IMottattKlageinstansParams extends IOppgavebehandlingBaseParams {
  mottattKlageinstans: string; // LocalDate
}

export interface IMottattVedtaksinstansParams extends IOppgavebehandlingBaseParams {
  mottattVedtaksinstans: string; // LocalDate
  typeId: SaksTypeEnum.KLAGE;
}

export interface IOppgavebehandlingUtfallUpdateParams extends IOppgavebehandlingBaseParams {
  utfall: UtfallEnum | null;
}

export interface IOppgavebehandlingHjemlerUpdateParams extends IOppgavebehandlingBaseParams {
  hjemler: string[];
}

export interface IKjennelseMottattParams extends IOppgavebehandlingBaseParams {
  kjennelseMottatt: string | null; // LocalDate
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN;
}

export interface ISendtTilTrygderettenParams extends IOppgavebehandlingBaseParams {
  sendtTilTrygderetten: string; // LocalDate
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN;
}

export type ICheckDocumentParams = IDocumentReference & IOppgavebehandlingBaseParams;

export interface ISetMedunderskriverParams extends IOppgavebehandlingBaseParams {
  medunderskriver: ISaksbehandler | null;
}

export interface ISwitchMedunderskriverflytParams {
  oppgaveId: string;
  isSaksbehandler: boolean;
}

export interface ISetFullmektigParams extends IOppgavebehandlingBaseParams {
  fullmektig: IPart | null;
}

export interface IFinishOppgavebehandlingParams {
  oppgaveId: string;
  kvalitetsvurderingId: string | null;
}

export interface ISetFeilregistrertParams extends IOppgavebehandlingBaseParams {
  reason: string;
}
