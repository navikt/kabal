import { Name } from '../domain/types';
import { IKodeverkVerdi } from './kodeverk';
import { IDocumentReference, IKlagebehandlingUpdate } from './oppgave-types';

export enum Gender {
  MALE = 'MANN',
  FEMALE = 'KVINNE',
}

export enum Utfall {
  TRUKKET = 'TRUKKET',
  RETUR = 'RETUR',
  OPPHEVET = 'OPPHEVET',
  MEDHOLD = 'MEDHOLD',
  DELVIS_MEDHOLD = 'DELVIS_MEDHOLD',
  OPPRETTHOLDT = 'OPPRETTHOLDT',
  UGUNST = 'UGUNST',
  AVVIST = 'AVVIST',
}

export enum MedunderskriverFlyt {
  IKKE_SENDT = 'IKKE_SENDT',
  OVERSENDT_TIL_MEDUNDERSKRIVER = 'OVERSENDT_TIL_MEDUNDERSKRIVER',
  RETURNERT_TIL_SAKSBEHANDLER = 'RETURNERT_TIL_SAKSBEHANDLER',
}

export interface IKlagebehandlingState {
  opptatt: boolean;
  lagretVersjon: IKlagebehandlingUpdate | null;
  error: string | null;
  klagebehandling: IKlagebehandling | null;
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
export interface IKlagebehandling {
  avsluttetAvSaksbehandler: string | null;
  created: string; // LocalDateTime
  datoSendtMedunderskriver: string | null; // LocalDate
  eoes: string | null;
  fraNAVEnhet: string | null;
  fraNAVEnhetNavn: string | null;
  fraSaksbehandlerident: string | null;
  frist: string | null;
  hjemler: string[];
  id: string;
  internVurdering: string;
  klagebehandlingVersjon: number;
  klageInnsendtdato: string | null; // LocalDate
  klager: IKlager;
  klagerFoedselsnummer: string | null;
  klagerKjoenn: Gender | null;
  klagerNavn: Name | null;
  klagerVirksomhetsnavn: string | null;
  klagerVirksomhetsnummer: string | null;
  kommentarFraFoersteinstans: string | null;
  medunderskriverFlyt: MedunderskriverFlyt;
  medunderskriverident: string | null;
  modified: string; // LocalDateTime
  mottatt: string | null; // LocalDate
  mottattFoersteinstans: string | null; // LocalDate
  mottattKlageinstans: string | null; // LocalDate
  raadfoertMedLege: string | null;
  sakenGjelder: IKlager;
  sakenGjelderFoedselsnummer: string | null;
  sakenGjelderKjoenn: Gender | null;
  sakenGjelderNavn: Name | null;
  sakenGjelderVirksomhetsnavn: string | null;
  sakenGjelderVirksomhetsnummer: string | null;
  strengtFortrolig: boolean | null;
  sendTilbakemelding: boolean | null;
  tema: string;
  tilbakemelding: string | null;
  tildelt: string | null; // LocalDate
  tildeltSaksbehandlerident: string | null;
  type: string;
  vedtak: Vedtak[];
  vedtaket: Vedtak;
  tilknyttedeDokumenter: IDocumentReference[];
  egenansatt: boolean;
  fortrolig: boolean;
}

export interface Vedtak {
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
