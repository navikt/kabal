import type { INavEmployee } from '@app/types/bruker';
import type { UtfallEnum } from '@app/types/kodeverk';
import type { FlowState, IMedunderskriverRol, ISakenGjelder, ISattPåVent } from '@app/types/oppgave-common';
import type { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import type { FradelReason } from '@app/types/oppgaver';
import type { BehandlingstidUnitType } from '@app/types/svarbrev';

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

export type ISetMedunderskriverResponse = IModifiedResponse & IMedunderskriverRol;

export type ISetRolResponse = IModifiedResponse & IMedunderskriverRol;

export type ISetFlowStateResponse = IModifiedResponse & IMedunderskriverRol;

export interface ISetExtraUtfallResponse extends IModifiedResponse {
  extraUtfallIdSet: UtfallEnum[];
}

export interface ISetUtfallResponse extends ISetExtraUtfallResponse {
  utfallId: UtfallEnum | null;
}

export enum HistoryEventTypes {
  TILDELING = 'TILDELING',
  MEDUNDERSKRIVER = 'MEDUNDERSKRIVER',
  ROL = 'ROL',
  KLAGER = 'KLAGER',
  FULLMEKTIG = 'FULLMEKTIG',
  SATT_PAA_VENT = 'SATT_PAA_VENT',
  FERDIGSTILT = 'FERDIGSTILT',
  FEILREGISTRERT = 'FEILREGISTRERT',
  VARSLET_BEHANDLINGSTID = 'VARSLET_BEHANDLINGSTID',
  FORLENGET_BEHANDLINGSTID = 'FORLENGET_BEHANDLINGSTID',
}

export interface BaseEvent<T, E extends HistoryEventTypes> {
  type: E;
  timestamp: string; // DateTime
  /** `null` means lack of data. Should not happen. Show as unknown user. */
  actor: INavEmployee | null;
  event: T;
}

interface WithPrevious<T, E extends HistoryEventTypes> extends BaseEvent<T, E> {
  previous: BaseEvent<T, E>;
}

interface TildelingEvent {
  saksbehandler: INavEmployee | null; // Nav Ident
  fradelingReasonId: FradelReason | null;
  /** `null` means no change. */
  hjemmelIdList: string[] | null;
}

export interface MedunderskriverEvent {
  /** Nav Ident. `null` betyr "felles kø". */
  medunderskriver: INavEmployee | null; // Nav Ident
  flow: FlowState;
}

export interface RolEvent {
  /** Nav Ident. `null` betyr "felles kø". */
  rol: INavEmployee | null; // Nav Ident
  flow: FlowState;
}

interface FeilregistrertEvent {
  reason: string;
}

export interface IPart {
  identifikator: string | null;
  type: string;
  name: string | null;
}

export interface KlagerEvent {
  part: IPart;
}

export interface FullmektigEvent {
  part: IPart | null;
}

interface FerdigstiltEvent {
  avsluttetAvSaksbehandler: string; // DateTime
}

interface VarsletBehandlingstidEvent {
  varsletBehandlingstidUnits: number | null;
  varsletBehandlingstidUnitTypeId: BehandlingstidUnitType | null;
  varsletFrist: string | null; // DateTime
  mottakere: IPart[] | null;
}

interface ForlengetBehandlingstidEvent extends VarsletBehandlingstidEvent {
  reasonNoLetter: string | null;
  doNotSendLetter: boolean;
}

export type ITildelingEvent = WithPrevious<TildelingEvent, HistoryEventTypes.TILDELING>;
export type IMedunderskriverEvent = WithPrevious<MedunderskriverEvent, HistoryEventTypes.MEDUNDERSKRIVER>;
export type IRolEvent = WithPrevious<RolEvent, HistoryEventTypes.ROL>;
export type IKlagerEvent = WithPrevious<KlagerEvent, HistoryEventTypes.KLAGER>;
export type IFullmektigEvent = WithPrevious<FullmektigEvent, HistoryEventTypes.FULLMEKTIG>;
export type ISattPaaVentEvent = WithPrevious<ISattPåVent | null, HistoryEventTypes.SATT_PAA_VENT>;
export type IFerdigstiltEvent = WithPrevious<FerdigstiltEvent | null, HistoryEventTypes.FERDIGSTILT>;
export type IFeilregistrertEvent = WithPrevious<FeilregistrertEvent | null, HistoryEventTypes.FEILREGISTRERT>;
export type IVarsletBehandlingstidEvent = WithPrevious<
  VarsletBehandlingstidEvent,
  HistoryEventTypes.VARSLET_BEHANDLINGSTID
>;
export type IForlengetBehandlingstidEvent = WithPrevious<
  ForlengetBehandlingstidEvent,
  HistoryEventTypes.FORLENGET_BEHANDLINGSTID
>;

export type IHistory =
  | ITildelingEvent
  | IMedunderskriverEvent
  | IRolEvent
  | IKlagerEvent
  | IFullmektigEvent
  | ISattPaaVentEvent
  | IFerdigstiltEvent
  | IFeilregistrertEvent
  | IVarsletBehandlingstidEvent
  | IForlengetBehandlingstidEvent;

export interface IHistoryResponse {
  tildeling: ITildelingEvent[];
  medunderskriver: IMedunderskriverEvent[];
  rol: IRolEvent[];
  klager: IKlagerEvent[];
  fullmektig: IFullmektigEvent[];
  sattPaaVent: ISattPaaVentEvent[];
  ferdigstilt: IFerdigstiltEvent[];
  feilregistrert: IFeilregistrertEvent[];
  varsletBehandlingstid: IVarsletBehandlingstidEvent[];
  forlengetBehandlingstid: IForlengetBehandlingstidEvent[];
}
