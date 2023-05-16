import { Name } from '@app/domain/types';
import { GenericObject } from '@app/types/types';
import { MedunderskriverFlyt, SaksTypeEnum, UtfallEnum } from './kodeverk';
import { ISaksbehandler } from './oppgave-common';

type Date = string; // LocalDate

export interface ApiResponse {
  antallTreffTotalt: number;
  behandlinger: string[];
}

export interface UtgaatteApiResponse {
  antall: number;
}

export interface IPerson {
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
  frist: Date | null;
  harMedunderskriver: boolean;
  hjemmel: string;
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriverFlyt: MedunderskriverFlyt;
  medunderskriverident: string | null;
  medunderskriverNavn: string | null;
  mottatt: Date;
  saksbehandlerHarTilgang: boolean;
  strengtFortrolig: boolean;
  tema: string;
  tildeltSaksbehandlerident: string | null;
  tildeltSaksbehandlerNavn: string | null;
  type: SaksTypeEnum;
  ytelse: string;
  utfall: UtfallEnum | null;
  sattPaaVent: IVenteperiode | null;
}

export enum SortFieldEnum {
  FRIST = 'FRIST',
  MOTTATT = 'MOTTATT',
  ALDER = 'ALDER',
}

export enum SortOrderEnum {
  STIGENDE = 'STIGENDE',
  SYNKENDE = 'SYNKENDE',
}

interface CommonOppgaverParams extends GenericObject {
  typer?: string[];
  ytelser?: string[];
  hjemler?: string[];
  sortering: 'FRIST' | 'MOTTATT' | 'ALDER';
  rekkefoelge: 'STIGENDE' | 'SYNKENDE';
}

interface EnhetParam {
  enhetId: string;
}

interface FerdigstiltParam extends CommonOppgaverParams {
  ferdigstiltDaysAgo: number;
}

interface TildelteSaksbehandlereParam {
  tildelteSaksbehandlere?: string[];
}

export type MineUferdigeOppgaverParams = CommonOppgaverParams;

export type MineFerdigstilteOppgaverParams = CommonOppgaverParams & FerdigstiltParam;

export type LedigeOppgaverParams = CommonOppgaverParams;

export type UtgaatteOppgaverParams = CommonOppgaverParams & FerdigstiltParam;

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

export interface IPersonAndOppgaverResponseOld extends ISearchPerson {
  aapneBehandlinger: IOppgave[] | string[];
  avsluttedeBehandlinger: IOppgave[] | string[];
}

export interface IPersonAndOppgaverResponse extends ISearchPerson {
  aapneBehandlinger: string[];
  avsluttedeBehandlinger: string[];
}

export interface ITildelingResponse {
  saksbehandler: ISaksbehandler | null;
  modified: Date;
}
