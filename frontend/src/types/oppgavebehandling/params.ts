import { SaksTypeEnum, UtfallEnum } from '../kodeverk';
import { FlowState, IDocumentReference, IPart } from '../oppgave-common';
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
  navIdent: string | null;
}

export interface ISetFlowStateParams extends IOppgavebehandlingBaseParams {
  flowState: FlowState;
}

export interface ISetFullmektigParams extends IOppgavebehandlingBaseParams {
  fullmektig: IPart | null;
}

export interface ISetKlagerParams extends IOppgavebehandlingBaseParams {
  klager: IPart;
}

export type IFinishOppgavebehandlingParams =
  | IDefaultFinishOppgavebehandlingParams
  | IFinishOppgavebehandlingOpphevetTRParams;

interface IDefaultFinishOppgavebehandlingParams {
  oppgaveId: string;
  kvalitetsvurderingId: string | null;
  nyBehandling: false;
}

interface IFinishOppgavebehandlingOpphevetTRParams extends Omit<IDefaultFinishOppgavebehandlingParams, 'nyBehandling'> {
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN;
  utfall: UtfallEnum.OPPHEVET;
  nyBehandling: boolean;
}

export interface ISetFeilregistrertParams extends IOppgavebehandlingBaseParams {
  reason: string;
}

export interface ISettPaaVentParams extends IOppgavebehandlingBaseParams {
  to: string; // string($date)
  reason: string;
}

export enum ValidationType {
  FINISH = 'fullfoer',
  FEILREGISTRERING = 'feilregistrer',
  NEW_ANKEBEHANDLING = 'nyankebehandling',
}

export interface IValidationParams extends IOppgavebehandlingBaseParams {
  type: ValidationType;
}

export interface ISetRolParams extends IOppgavebehandlingBaseParams {
  navIdent: string | null;
}
