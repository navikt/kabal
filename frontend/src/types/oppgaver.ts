import { Name } from '@app/domain/types';
import { MedunderskriverFlyt, SaksTypeEnum } from './kodeverk';
import { ISaksbehandler } from './oppgave-common';

type Date = string; // LocalDate

export interface ApiResponse {
  antallTreffTotalt: number;
  behandlinger: IOppgave[];
}

export interface UtgaatteApiResponse {
  antall: number;
}

interface Person {
  navn: string;
  fnr: string;
}

interface IVenteperiode {
  from: Date;
  to: Date;
  isExpired: boolean;
}

export interface IOppgave {
  ageKA: number; // Age in days.
  avsluttetAvSaksbehandlerDate: Date | null;
  egenAnsatt: boolean;
  erMedunderskriver: boolean;
  erTildelt: boolean;
  fortrolig: boolean;
  frist: Date | null;
  harMedunderskriver: boolean;
  hjemmel: string;
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriverFlyt: MedunderskriverFlyt;
  medunderskriverident: string | null;
  medunderskriverNavn: string | null;
  mottatt: Date;
  person: Person | null;
  saksbehandlerHarTilgang: boolean;
  strengtFortrolig: boolean;
  tema: string;
  tildeltSaksbehandlerident: string | null;
  tildeltSaksbehandlerNavn: string | null;
  type: SaksTypeEnum;
  ytelse: string;
  utfall: string | null;
  sattPaaVent: IVenteperiode | null;
}

export type IOppgaveList = IOppgave[];

export enum SortFieldEnum {
  FRIST = 'FRIST',
  MOTTATT = 'MOTTATT',
  ALDER = 'ALDER',
}

export enum SortOrderEnum {
  STIGENDE = 'STIGENDE',
  SYNKENDE = 'SYNKENDE',
}

interface CommonOppgaverParams {
  typer?: string[];
  ytelser?: string[];
  hjemler?: string[];
  sortering: 'FRIST' | 'MOTTATT' | 'ALDER';
  rekkefoelge: 'STIGENDE' | 'SYNKENDE';
  start: number;
  antall: number;
}

interface EnhetParam {
  enhetId: string;
}

interface FerdigstiltParam extends CommonOppgaverParams {
  ferdigstiltDaysAgo: number;
}

interface NavidentParam {
  navIdent: string;
}

interface TildelteSaksbehandlereParam {
  tildelteSaksbehandlere?: string[];
}

export type MineUferdigeOppgaverParams = CommonOppgaverParams & NavidentParam;

export type MineFerdigstilteOppgaverParams = CommonOppgaverParams & FerdigstiltParam & NavidentParam;

export type LedigeOppgaverParams = CommonOppgaverParams & NavidentParam;

export type UtgaatteOppgaverParams = CommonOppgaverParams & FerdigstiltParam & NavidentParam;

export type EnhetensFerdigstilteOppgaverParams = CommonOppgaverParams &
  FerdigstiltParam &
  EnhetParam &
  TildelteSaksbehandlereParam;

export type EnhetensUferdigeOppgaverParams = CommonOppgaverParams & EnhetParam & TildelteSaksbehandlereParam;

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

export interface ISearchPerson {
  fnr: string;
  navn: Name;
}

export interface INameSearchResponse {
  people: ISearchPerson[];
}
export interface ISaksbehandlere {
  saksbehandlere: ISaksbehandler[];
}

export interface IPersonAndOppgaverResponse extends ISearchPerson {
  aapneBehandlinger: IOppgave[];
  avsluttedeBehandlinger: IOppgave[];
  behandlinger: IOppgave[];
}

export interface ITildelingResponse {
  saksbehandler: ISaksbehandler | null;
  modified: Date;
}
