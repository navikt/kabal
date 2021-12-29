import { Name } from '../domain/types';
import { ISaksbehandler, MedunderskriverFlyt, OppgaveType } from './oppgavebehandling-common-types';

export type Date = string; // LocalDate

export interface ApiResponse {
  antallTreffTotalt: number;
  klagebehandlinger: IOppgave[];
}

export interface UtgaatteApiResponse {
  antall: number;
}

export interface Person {
  navn: string;
  fnr: string;
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

export interface LoadLedigeOppgaverParams {
  start: number;
  antall: number;
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
  ytelser?: string[];
  typer?: OppgaveType[];
  hjemler?: string[];
  navIdent: string;
  ferdigstiltDaysAgo?: number;
  projeksjon?: 'UTVIDET';
  enhet: string | null;
}

export interface LoadTildelteOppgaverParams extends LoadLedigeOppgaverParams {
  tildeltSaksbehandler: string[];
}

export interface LoadOppgaverParams extends LoadLedigeOppgaverParams {
  tildeltSaksbehandler?: string[];
  erTildeltSaksbehandler: boolean;
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

export interface IFnrSearchResponse {
  fnr: string;
  navn: Name;
  aapneKlagebehandlinger: IOppgaveList;
  avsluttedeKlagebehandlinger: IOppgaveList;
  klagebehandlinger: IOppgaveList;
}

export interface INameSearchParams {
  antall: number;
  query: string;
  start: number;
}

export interface INameSearchResponse {
  people: {
    fnr: string;
    navn: Name;
  }[];
}
export interface IGetSaksbehandlereInEnhetResponse {
  saksbehandlere: ISaksbehandler[];
}
