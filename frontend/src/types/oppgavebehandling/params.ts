import type { INavEmployee } from '@app/types/bruker';
import type { SaksTypeEnum, UtfallEnum } from '../kodeverk';
import type { BaseSattPåVent, FlowState, IFullmektig, IJournalfoertDokumentId, IPart } from '../oppgave-common';

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
  utfallId: UtfallEnum | null;
}

export interface IOppgavebehandlingUtfallSetUpdateParams extends IOppgavebehandlingBaseParams {
  extraUtfallIdSet: UtfallEnum[];
}

export interface IOppgavebehandlingHjemlerUpdateParams extends IOppgavebehandlingBaseParams {
  hjemmelIdSet: string[];
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

export interface IBatchDocumentParams extends IOppgavebehandlingBaseParams {
  documentIdList: IJournalfoertDokumentId[];
}

export interface ISetMedunderskriverParams extends IOppgavebehandlingBaseParams {
  employee: INavEmployee | null;
}

export interface ISetFlowStateParams extends IOppgavebehandlingBaseParams {
  flowState: FlowState;
}

export interface ISetFullmektigParams extends IOppgavebehandlingBaseParams {
  fullmektig: IFullmektig | null;
}

export interface ISetKlagerParams extends IOppgavebehandlingBaseParams {
  klager: IPart;
}

export interface SetTilbakekrevingParams extends IOppgavebehandlingBaseParams {
  tilbakekreving: boolean;
}

export type IFinishOppgavebehandlingParams =
  | IDefaultFinishOppgavebehandlingParams
  | IFinishOppgavebehandlingOpphevetTRParams;

export interface IFinishWithUpdateInGosys extends Omit<IDefaultFinishOppgavebehandlingParams, 'nyBehandling'> {
  gosysOppgaveUpdate: {
    tildeltEnhet: string;
    mappeId: number | null;
    kommentar: string;
  } | null;
  ignoreGosysOppgave: boolean;
}

interface IDefaultFinishOppgavebehandlingParams {
  oppgaveId: string;
  kvalitetsvurderingId: string | null;
  nyBehandling: false;
}

interface IFinishOppgavebehandlingOpphevetTRParams extends Omit<IDefaultFinishOppgavebehandlingParams, 'nyBehandling'> {
  typeId: SaksTypeEnum.ANKE_I_TRYGDERETTEN;
  nyBehandling: boolean;
}

export interface ISetFeilregistrertParams extends IOppgavebehandlingBaseParams {
  reason: string;
}

export interface ISettPaaVentParams extends IOppgavebehandlingBaseParams {
  sattPaaVent: BaseSattPåVent;
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

export interface ISetInnsendingshjemlerParams extends IOppgavebehandlingBaseParams {
  hjemmelIdList: string[];
}
