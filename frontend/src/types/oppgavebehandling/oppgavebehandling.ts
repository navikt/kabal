import { Name } from '../../domain/types';
import { Gender, MedunderskriverFlyt, OppgaveType, Utfall } from '../kodeverk';
import { ISaksbehandler, IVedlegg } from '../oppgave-common';

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
  klager: ISakspart;
  kommentarFraVedtaksinstans: string | null;
  kvalitetsvurderingId: string;
  medunderskriver: ISaksbehandler | null;
  medunderskriverFlyt: MedunderskriverFlyt;
  modified: string; // LocalDateTime
  mottatt: string | null; // LocalDate
  mottattVedtaksinstans: string | null; // LocalDate
  mottattKlageinstans: string | null; // LocalDate
  prosessfullmektig: ISakspart | null;
  raadfoertMedLege: string | null;
  resultat: Resultat;
  sakenGjelder: ISakspart;
  sattPaaVent: string | null; // LocalDateTime
  sendTilbakemelding: boolean | null;
  strengtFortrolig: boolean;
  tema: string;
  tilbakemelding: string | null;
  tildelt: string | null; // LocalDate
  tildeltSaksbehandler: ISaksbehandler | null;
  tildeltSaksbehandlerEnhet: string | null;
  ytelse: string;
}

interface IKlagebehandling extends IOppgavebehandlingBase {
  type: OppgaveType.KLAGE;
}

interface IAnkebehandling extends IOppgavebehandlingBase {
  type: OppgaveType.ANKE;
}

export interface ITrygderettsankebehandling extends IOppgavebehandlingBase {
  type: OppgaveType.ANKE_I_TRYGDERETTEN;
  kjennelseMottatt: string | null; // LocalDate
  sendtTilTrygderetten: string | null; // LocalDate
}

export type IOppgavebehandling = IKlagebehandling | IAnkebehandling | ITrygderettsankebehandling;

export interface ISakspart {
  person: IKlagerPerson | null;
  virksomhet: IVirksomhet | null;
}

interface Resultat {
  file: IVedlegg | null;
  hjemler: string[];
  id: string;
  utfall: Utfall | null;
}

interface IKlagerPerson {
  navn: Name;
  foedselsnummer: string | null;
  kjoenn: Gender | null;
}

export interface IVirksomhet {
  virksomhetsnummer: string | null;
  navn: string | null;
}
