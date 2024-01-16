/* eslint-disable import/no-unused-modules */
import { UtfallEnum } from '@app/types/kodeverk';
import { IFeilregistrering } from '@app/types/oppgavebehandling/oppgavebehandling';
import { FradelReason } from '@app/types/oppgaver';
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

export enum HistoryEventTypes {
  TILDELING = 'TILDELING',
  MEDUNDERSKRIVER = 'MEDUNDERSKRIVER',
  ROL = 'ROL',
  KLAGER = 'KLAGER',
  FULLMEKTIG = 'FULLMEKTIG',
  SATT_PAA_VENT = 'SATT_PAA_VENT',
  FERDIGSTILT = 'FERDIGSTILT',
  FEILREGISTRERT = 'FEILREGISTRERT',
}

export interface BaseEvent<T, E extends HistoryEventTypes> {
  type: E;
  timestamp: string; // DateTime
  /** `null` means lack of data. Should not happen. Show as unknown user. */
  actor: string | null; // NAV Ident
  event: T;
}

interface WithPrevious<T, E extends HistoryEventTypes> extends BaseEvent<T, E> {
  previous: BaseEvent<T, E>;
}

interface FradelingEvent {
  saksbehandler: string | null; // NAV Ident
  fradelingReasonId: FradelReason;
  /** `null` means no change. */
  hjemmelIdList: string[] | null;
}

interface TildelingEvent {
  saksbehandler: string | null; // NAV Ident
  fradelingReasonId: null;
  /** `null` means no change. */
  hjemmelIdList: string[] | null;
}

export interface MedunderskriverEvent {
  /** Nav Ident. `null` betyr "felles kø". */
  medunderskriver: string | null; // NAV Ident
  flow: FlowState;
}

export interface RolEvent {
  /** Nav Ident. `null` betyr "felles kø". */
  rol: string | null; // NAV Ident
  flow: FlowState;
}

export interface SattPaaVentEvent {
  from: string; // Date
  to: string; // Date
  reason: string;
}

interface FeilregistrertEvent {
  reason: string;
}

export interface IPart {
  id: string;
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

export type ITildelingEvent = WithPrevious<TildelingEvent | FradelingEvent, HistoryEventTypes.TILDELING>;
export type IMedunderskriverEvent = WithPrevious<MedunderskriverEvent, HistoryEventTypes.MEDUNDERSKRIVER>;
export type IRolEvent = WithPrevious<RolEvent, HistoryEventTypes.ROL>;
export type IKlagerEvent = WithPrevious<KlagerEvent, HistoryEventTypes.KLAGER>;
export type IFullmektigEvent = WithPrevious<FullmektigEvent, HistoryEventTypes.FULLMEKTIG>;
export type ISattPaaVentEvent = WithPrevious<SattPaaVentEvent | null, HistoryEventTypes.SATT_PAA_VENT>;
export type IFerdigstiltEvent = WithPrevious<FerdigstiltEvent | null, HistoryEventTypes.FERDIGSTILT>;
export type IFeilregistrertEvent = WithPrevious<FeilregistrertEvent | null, HistoryEventTypes.FEILREGISTRERT>;

export type IHistory =
  | ITildelingEvent
  | IMedunderskriverEvent
  | IRolEvent
  | IKlagerEvent
  | IFullmektigEvent
  | ISattPaaVentEvent
  | IFerdigstiltEvent
  | IFeilregistrertEvent;

export interface IHistoryResponse {
  tildeling: ITildelingEvent[];
  medunderskriver: IMedunderskriverEvent[];
  rol: IRolEvent[];
  klager: IKlagerEvent[];
  fullmektig: IFullmektigEvent[];
  sattPaaVent: ISattPaaVentEvent[];
  ferdigstilt: IFerdigstiltEvent[];
  feilregistrert: IFeilregistrertEvent[];
}
