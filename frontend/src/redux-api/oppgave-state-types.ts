import { Name } from '../domain/types';
import { IKodeverkVerdi } from './kodeverk';
import { IDocumentReference } from './oppgave-types';

export enum Gender {
  MALE = 'MANN',
  FEMALE = 'KVINNE',
}

export enum Utfall {
  TRUKKET = '1',
  RETUR = '2',
  OPPHEVET = '3',
  MEDHOLD = '4',
  DELVIS_MEDHOLD = '5',
  OPPRETTHOLDT = '6',
  UGUNST = '7',
  AVVIST = '8',
}

export enum MedunderskriverFlyt {
  IKKE_SENDT = 'IKKE_SENDT',
  OVERSENDT_TIL_MEDUNDERSKRIVER = 'OVERSENDT_TIL_MEDUNDERSKRIVER',
  RETURNERT_TIL_SAKSBEHANDLER = 'RETURNERT_TIL_SAKSBEHANDLER',
}

export interface IKlagerPerson {
  navn: Name;
  foedselsnummer: string | null;
  kjoenn: string | null;
}

export interface IVirksomhet {
  virksomhetsnummer: string | null;
  navn: string | null;
}

export interface IKlager {
  person: IKlagerPerson;
  virksomhet: IVirksomhet;
}

export interface ISaksbehandler {
  navIdent: string;
  navn: string;
}

export interface IKlagebehandling {
  avsluttetAvSaksbehandlerDate: string | null; // LocalDate
  created: string; // LocalDateTime
  datoSendtMedunderskriver: string | null; // LocalDate
  egenansatt: boolean;
  eoes: string | null;
  fortrolig: boolean;
  fraNAVEnhet: string | null;
  fraNAVEnhetNavn: string | null;
  fraSaksbehandlerident: string | null;
  frist: string | null;
  hjemler: string[];
  id: string;
  internVurdering: string;
  isAvsluttetAvSaksbehandler: boolean;
  klagebehandlingVersjon: number;
  klageInnsendtdato: string | null; // LocalDate
  klager: IKlager;
  klagerFoedselsnummer: string | null;
  klagerKjoenn: Gender | null;
  klagerNavn: Name | null;
  klagerVirksomhetsnavn: string | null;
  klagerVirksomhetsnummer: string | null;
  kommentarFraFoersteinstans: string | null;
  medunderskriver: ISaksbehandler | null;
  medunderskriverFlyt: MedunderskriverFlyt;
  modified: string; // LocalDateTime
  mottatt: string | null; // LocalDate
  mottattFoersteinstans: string | null; // LocalDate
  mottattKlageinstans: string | null; // LocalDate
  raadfoertMedLege: string | null;
  resultat: Resultat;
  sakenGjelder: IKlager;
  sakenGjelderFoedselsnummer: string | null;
  sakenGjelderKjoenn: Gender | null;
  sakenGjelderNavn: Name | null;
  sakenGjelderVirksomhetsnavn: string | null;
  sakenGjelderVirksomhetsnummer: string | null;
  sendTilbakemelding: boolean | null;
  strengtFortrolig: boolean | null;
  tema: string;
  tilbakemelding: string | null;
  tildelt: string | null; // LocalDate
  tildeltSaksbehandler: ISaksbehandler | null;
  tilknyttedeDokumenter: IDocumentReference[];
  type: string;
}

export interface Resultat {
  brevMottakere: IBrevMottaker[];
  ferdigstilt: string | null; // LocalDateTime
  file: IVedlegg | null;
  grunn: string | null;
  hjemler: string[];
  id: string;
  opplastet: string | null; // LocalDateTime
  utfall: Utfall | null;
}

export interface IBrevMottaker {
  type: string;
  id: string;
  rolle: string;
}

export interface IHjemmel {
  kapittel: number;
  paragraf: number;
  ledd?: number;
  bokstav?: string;
  original?: string;
}

export interface IVedlegg {
  name: string;
  size: number;
  opplastet: string | null; // LocalDateTime
}

export interface GrunnerPerUtfall {
  utfallId: string;
  grunner: IKodeverkVerdi[];
}

export interface IKlagePayload {
  id: string;
}

export interface IDokumenter {
  saksbehandlerHarTilgang: boolean;
}

export interface IDokumentPayload {
  id: string;
  journalpostId: string;
  dokumentInfoId: string;
  erVedlegg: boolean;
}

export interface IDokumentParams {
  id: string;
  idx: number;
  handling: string;
  antall: number;
  ref: string | null;
  historyNavigate: boolean;
}
