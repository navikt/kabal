import type { INavEmployee } from '@app/types/bruker';
import type { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import type { IHelper, IVenteperiode } from '@app/types/oppgave-common';

/** DateTime */
type DateString = string;

export interface ApiResponse {
  antallTreffTotalt: number;
  behandlinger: string[];
}

export interface RelevantOppgaverResponse {
  aapneBehandlinger: string[];
  paaVentBehandlinger: string[];
}

export interface UtgaatteApiResponse {
  antall: number;
}

interface IOppgaveRowVenteperiode extends IVenteperiode {
  isExpired: boolean;
}

export interface IOppgave {
  /** Age in days. */
  ageKA: number;
  /** Date
   * @format yyyy-MM-dd
   */
  avsluttetAvSaksbehandlerDate: DateString | null;
  fagsystemId: string;
  /** Date
   * @format yyyy-MM-dd
   */
  frist: DateString | null;
  /** Date
   * @format yyyy-MM-dd
   */
  varsletFrist: DateString | null;
  timesPreviouslyExtended: number;
  hjemmelIdList: string[];
  registreringshjemmelIdList: string[];
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriver: IHelper;
  rol: IHelper;
  /** Date
   * @format yyyy-MM-dd
   */
  mottatt: DateString;
  tildeltSaksbehandlerident: string | null;
  /** DateTime */
  tildeltTimestamp?: DateString;
  typeId: SaksTypeEnum;
  ytelseId: string;
  utfallId: UtfallEnum | null;
  sattPaaVent: IOppgaveRowVenteperiode | null;
  feilregistrert: DateString | null;
  saksnummer: string;
  /** Date
   * @format yyyy-MM-dd
   */
  datoSendtTilTR: DateString | null;
  previousSaksbehandler: INavEmployee | null;
}

export enum SortFieldEnum {
  FRIST = 'FRIST',
  VARSLET_FRIST = 'VARSLET_FRIST',
  MOTTATT = 'MOTTATT',
  ALDER = 'ALDER',
  PAA_VENT_FROM = 'PAA_VENT_FROM',
  PAA_VENT_TO = 'PAA_VENT_TO',
  AVSLUTTET_AV_SAKSBEHANDLER = 'AVSLUTTET_AV_SAKSBEHANDLER',
  RETURNERT_FRA_ROL = 'RETURNERT_FRA_ROL',
}

export const SORT_FIELD_ENUM_VALUES = Object.values(SortFieldEnum);

export const isSortFieldEnum = (value: string): value is SortFieldEnum =>
  SORT_FIELD_ENUM_VALUES.includes(value as SortFieldEnum);

/** API param */
export enum SortOrderEnum {
  ASC = 'STIGENDE',
  DESC = 'SYNKENDE',
}

export const SORT_ORDER_ENUM_VALUES = Object.values(SortOrderEnum);

export const isSortOrderEnum = (value: string): value is SortOrderEnum =>
  SORT_ORDER_ENUM_VALUES.includes(value as SortOrderEnum);

export interface FromDateSortKeys {
  ferdigstiltFrom?: string;
  returnertFrom?: string;
  fristFrom?: string;
  varsletFristFrom?: string;
}

export interface ToDateSortKeys {
  ferdigstiltTo?: string;
  returnertTo?: string;
  fristTo?: string;
  varsletFristTo?: string;
}

export interface CommonOppgaverParams extends FromDateSortKeys, ToDateSortKeys {
  typer?: SaksTypeEnum[];
  ytelser?: string[];
  hjemler?: string[];
  registreringshjemler?: string[];
  tildelteSaksbehandlere?: string[];
  medunderskrivere?: string[];
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
  tildelteRol?: string[];
}

export type CommonOppgaverParamsKey = keyof CommonOppgaverParams;

interface EnhetParam {
  enhetId: string;
}

export type EnhetensOppgaverParams = CommonOppgaverParams & EnhetParam;

export interface TildelSaksbehandlerParams {
  employee: INavEmployee;
  oppgaveId: string;
}

export enum FradelReason {
  FEIL_HJEMMEL = '1',
  MANGLER_KOMPETANSE = '2',
  INHABIL = '3',
  LENGRE_FRAVÆR = '4',
  ANNET = '5',
  LEDER = '6',
  UTGÅTT = '7',
  ANGRET = '8',
}

export const FradelReasonText: Record<FradelReason, string> = {
  [FradelReason.FEIL_HJEMMEL]: 'Feil hjemmel',
  [FradelReason.MANGLER_KOMPETANSE]: 'Mangler kompetanse',
  [FradelReason.INHABIL]: 'Inhabil',
  [FradelReason.LENGRE_FRAVÆR]: 'Lengre fravær',
  [FradelReason.ANNET]: 'Annet',
  [FradelReason.LEDER]: 'Oppgavestyring',
  [FradelReason.UTGÅTT]: 'Utgått',
  [FradelReason.ANGRET]: 'Angret tildeling',
};

interface FradelReasonBase {
  oppgaveId: string;
}

export interface FradelWithoutHjemler {
  reasonId:
    | FradelReason.MANGLER_KOMPETANSE
    | FradelReason.INHABIL
    | FradelReason.LENGRE_FRAVÆR
    | FradelReason.ANNET
    | FradelReason.LEDER
    | FradelReason.UTGÅTT
    | FradelReason.ANGRET;
}

export interface FradelWithHjemler {
  reasonId: FradelReason.FEIL_HJEMMEL;
  hjemmelIdList: string[];
}

export type FradelSaksbehandlerParams = FradelReasonBase & (FradelWithHjemler | FradelWithoutHjemler);

export interface ISaksbehandlere {
  saksbehandlere: INavEmployee[];
}

export interface IMedunderskrivere {
  medunderskrivere: INavEmployee[];
}

export interface IRolList {
  rolList: INavEmployee[];
}

export interface IRols {
  rols: INavEmployee[];
}

export interface IOppgaverResponse {
  aapneBehandlinger: string[];
  avsluttedeBehandlinger: string[];
  feilregistrerteBehandlinger: string[];
  paaVentBehandlinger: string[];
}

export interface ITildelingResponse {
  saksbehandler: INavEmployee | null;
  modified: DateString;
}

export interface IFradelingResponse {
  modified: DateString;
  hjemmelIdList: string[];
}
