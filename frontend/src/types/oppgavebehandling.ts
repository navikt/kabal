import { Name } from '../domain/types';
import { Gender, MedunderskriverFlyt, OppgaveType, Utfall } from './kodeverk';
import { IDocumentReference, ISaksbehandler, IVedlegg } from './oppgave-common';

export interface IOppgavebehandlingBase {
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
  klageInnsendtdato: string | null; // LocalDate
  klager: IKlager;
  kommentarFraFoersteinstans: string | null;
  kvalitetsvurderingId: string;
  medunderskriver: ISaksbehandler | null;
  medunderskriverFlyt: MedunderskriverFlyt;
  modified: string; // LocalDateTime
  mottatt: string | null; // LocalDate
  mottattFoersteinstans: string | null; // LocalDate
  mottattKlageinstans: string | null; // LocalDate
  raadfoertMedLege: string | null;
  resultat: Resultat;
  sakenGjelder: ISakenGjelder;
  sendTilbakemelding: boolean | null;
  strengtFortrolig: boolean;
  tema: string;
  tilbakemelding: string | null;
  tildelt: string | null; // LocalDate
  tildeltSaksbehandler: ISaksbehandler | null;
  tildeltSaksbehandlerEnhet: string | null;
  tilknyttedeDokumenter: IDocumentReference[];
  ytelse: string;
}

export interface IKlagebehandling extends IOppgavebehandlingBase {
  type: OppgaveType.KLAGEBEHANDLING;
}

export interface IAnkebehandling extends IOppgavebehandlingBase {
  type: OppgaveType.ANKEBEHANDLING;
  fullfoertGosys: boolean;
}

export type IOppgavebehandling = IKlagebehandling | IAnkebehandling;

export interface IKlager {
  person: IKlagerPerson | null;
  virksomhet: IVirksomhet | null;
}

export type ISakenGjelder = IKlager;

export interface Resultat {
  file: IVedlegg | null;
  hjemler: string[];
  id: string;
  utfall: Utfall | null;
}

export interface IBrevMottaker {
  type: string;
  id: string;
  rolle: string;
}

export interface IKlagerPerson {
  navn: Name;
  foedselsnummer: string | null;
  kjoenn: Gender | null;
}

export interface IVirksomhet {
  virksomhetsnummer: string | null;
  navn: string | null;
}
