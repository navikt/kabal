import { Name } from '../domain/types';
import { MedunderskriverFlyt, OppgaveType } from './kodeverk';
import { ISaksbehandler } from './oppgave-common';

export type Date = string; // LocalDate

export interface ApiResponse {
  antallTreffTotalt: number;
  behandlinger: IOppgave[];
}

export interface UtgaatteApiResponse {
  antall: number;
}

export interface Person {
  navn: string;
  fnr: string;
}

export interface IVenteperiode {
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
  frist: Date;
  harMedunderskriver: boolean;
  hjemmel: string;
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriverFlyt: MedunderskriverFlyt;
  medunderskriverident: string | null;
  mottatt: Date;
  person: Person | null;
  saksbehandlerHarTilgang: boolean;
  strengtFortrolig: boolean;
  tema: string;
  tildeltSaksbehandlerident: string | null;
  tildeltSaksbehandlerNavn: string | null;
  type: OppgaveType;
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

export interface CommonOppgaverParams {
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

export type MineLedigeOppgaverParams = CommonOppgaverParams & NavidentParam;

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
  navIdent: string;
  enhetId: string;
  oppgaveId: string;
}

export interface FradelSaksbehandlerParams {
  navIdent: string;
  oppgaveId: string;
}

export interface ISaksbehandlerResponse {
  modified: string;
  tildelt: string;
}

export interface IFnrSearchParams {
  enhet: string;
  query: string;
}

export interface IFnrSearchResponse extends ISearchPerson {
  aapneKlagebehandlinger: IOppgaveList;
  avsluttedeKlagebehandlinger: IOppgaveList;
  klagebehandlinger: IOppgaveList;
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
export interface IGetSaksbehandlereInEnhetResponse {
  saksbehandlere: ISaksbehandler[];
}

export interface IPersonAndOppgaverResponse extends ISearchPerson {
  aapneKlagebehandlinger: IOppgave[];
  avsluttedeKlagebehandlinger: IOppgave[];
  klagebehandlinger: IOppgave[];
}
