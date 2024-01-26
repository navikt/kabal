import { INavEmployee } from '@app/types/bruker';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { IHelper, IPartBase, IVenteperiode } from '@app/types/oppgave-common';

type DateString = string; // LocalDate

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
  ageKA: number; // Age in days.
  avsluttetAvSaksbehandlerDate: DateString | null;
  fagsystemId: string;
  frist: DateString | null;
  hjemmelIdList: string[];
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriver: IHelper;
  rol: IHelper;
  mottatt: DateString;
  tildeltSaksbehandlerident: string | null;
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
}

interface FradelReasonBase {
  oppgaveId: string;
}

export interface FradelWithoutHjemler {
  reasonId: Omit<FradelReason, FradelReason.FEIL_HJEMMEL>;
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
