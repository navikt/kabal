import { GenericObject } from '@app/types/types';
import { MedunderskriverFlyt, SaksTypeEnum, UtfallEnum } from './kodeverk';
import { INavEmployee, IPartBase, IVenteperiode } from './oppgave-common';

type Date = string; // LocalDate

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
  avsluttetAvSaksbehandlerDate: Date | null;
  fagsystemId: string;
  frist: Date | null;
  hjemmelId: string | null;
  id: string;
  isAvsluttetAvSaksbehandler: boolean;
  medunderskriverFlyt: MedunderskriverFlyt;
  medunderskriverident: string | null;
  mottatt: Date;
  tildeltSaksbehandlerident: string | null;
  typeId: SaksTypeEnum;
  ytelseId: string;
  utfallId: UtfallEnum | null;
  sattPaaVent: IOppgaveRowVenteperiode | null;
  feilregistrert: Date | null;
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
  modified: Date;
}
