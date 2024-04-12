import { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { IHelper, IPartBase, IVenteperiode } from '@app/types/oppgave-common';

/** DateTime */
type DateString = string;

export interface LovkildeToRegistreringshjemmelFilter {
  lovkildeId: string;
  registreringshjemmelIdList: string[];
}

export interface Filters {
  typer: SaksTypeEnum[];
  ytelser: string[];
  hjemler: string[];
  registreringshjemler: LovkildeToRegistreringshjemmelFilter[];
  ferdigstiltFrom: string;
  ferdigstiltTo: string;
  returnertFrom: string;
  returnertTo: string;
  tildelteSaksbehandlere: INavEmployee[];
  medunderskrivere: INavEmployee[];
  tildelteRol: INavEmployee[];
}

export interface ApiResponse {
  behandlinger: string[];
  filters: Filters;
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
  avsluttetAvSaksbehandlerDate: DateString | null;
  fagsystemId: string;
  frist: DateString | null;
  hjemmelIdList: string[];
  registreringshjemmelIdList: string[];
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriver: IHelper;
  rol: IHelper;
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
}

export enum SortFieldEnum {
  FRIST = 'FRIST',
  MOTTATT = 'MOTTATT',
  ALDER = 'ALDER',
  PAA_VENT_FROM = 'PAA_VENT_FROM',
  PAA_VENT_TO = 'PAA_VENT_TO',
  AVSLUTTET_AV_SAKSBEHANDLER = 'AVSLUTTET_AV_SAKSBEHANDLER',
  RETURNERT_FRA_ROL = 'RETURNERT_FRA_ROL',
}

export enum SortOrderEnum {
  STIGENDE = 'STIGENDE',
  SYNKENDE = 'SYNKENDE',
}

export interface CommonOppgaverParams {
  typer?: SaksTypeEnum[];
  ytelser?: string[];
  hjemler?: string[];
  registreringshjemler?: string[];
  ferdigstiltFrom?: string;
  ferdigstiltTo?: string;
  returnertFrom?: string;
  returnertTo?: string;
  tildelteSaksbehandlere?: string[];
  medunderskrivere?: string[];
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
  tildelteRol?: string[];
}

interface EnhetParam {
  enhetId: string;
}

export type EnhetensOppgaverParams = CommonOppgaverParams & EnhetParam;

export interface INameSearchParams {
  antall: number;
  query: string;
  start: number;
}

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

export interface INameSearchParams {
  antall: number;
  query: string;
  start: number;
}

export interface INameSearchResponse {
  people: IPartBase[];
}

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
