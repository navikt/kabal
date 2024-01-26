import { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum, UtfallEnum } from '../kodeverk';
import { FlowState, IJournalfoertDokumentId, IPart } from '../oppgave-common';

export interface IOppgavebehandlingBaseParams {
  oppgaveId: string;
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

export interface IOppgavebehandlingUtfallSetUpdateParams extends IOppgavebehandlingBaseParams {
  extraUtfallIdSet: UtfallEnum[];
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

export type ICheckDocumentParams = IJournalfoertDokumentId & IOppgavebehandlingBaseParams;

export interface ISetMedunderskriverParams extends IOppgavebehandlingBaseParams {
  employee: INavEmployee | null;
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
  employee: INavEmployee | null;
}
