import { MedunderskriverFlyt, SaksTypeEnum, UtfallEnum } from './kodeverk';
import { INavEmployee, IPartBase, IVenteperiode } from './oppgave-common';

type DateString = string; // LocalDate

export interface ApiResponse {
  antallTreffTotalt: number;
  behandlinger: string[];
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
  hjemmelId: string | null;
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriverFlyt: MedunderskriverFlyt;
  medunderskriverident: string | null;
  mottatt: DateString;
  tildeltSaksbehandlerident: string | null;
  typeId: SaksTypeEnum;
  ytelseId: string;
  utfallId: UtfallEnum | null;
  sattPaaVent: IOppgaveRowVenteperiode | null;
  feilregistrert: DateString | null;
}

export enum SortFieldEnum {
  FRIST = 'FRIST',
  MOTTATT = 'MOTTATT',
  ALDER = 'ALDER',
  AVSLUTTET_AV_SAKSBEHANDLER = 'AVSLUTTET_AV_SAKSBEHANDLER',
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
  tildelteSaksbehandlere?: string[];
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
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
  navIdent: string | null;
  oppgaveId: string;
}

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
