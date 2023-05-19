import { SexEnum } from '@app/types/kodeverk';
import {
  IAnkebehandling,
  IKlagebehandling,
  ITrygderettsankebehandling,
} from '@app/types/oppgavebehandling/oppgavebehandling';
import { IOppgave } from '@app/types/oppgaver';

interface LegacyKlagebehandling extends Omit<IKlagebehandling, 'klager' | 'sakenGjelder' | 'prosessfullmektig'> {
  klager: LegacyPartView;
  sakenGjelder: LegacyPartView;
  prosessfullmektig: LegacyPartView | null;
}

interface LegacyAnkebehandling extends Omit<IAnkebehandling, 'klager' | 'sakenGjelder' | 'prosessfullmektig'> {
  klager: LegacyPartView;
  sakenGjelder: LegacyPartView;
  prosessfullmektig: LegacyPartView | null;
}

interface LegacyTrygderettsankebehandling
  extends Omit<ITrygderettsankebehandling, 'klager' | 'sakenGjelder' | 'prosessfullmektig'> {
  klager: LegacyPartView;
  sakenGjelder: LegacyPartView;
  prosessfullmektig: LegacyPartView | null;
}

export type LegacyOppgavebehandling = LegacyKlagebehandling | LegacyAnkebehandling | LegacyTrygderettsankebehandling;

export interface LegacyNavn {
  fornavn: string | null;
  mellomnavn: string | null;
  etternavn: string | null;
}

interface LegacyPersonView {
  foedselsnummer: string;
  navn: LegacyNavn | null;
  kjoenn: SexEnum;
}

export interface LegacySakenGjelderResponse {
  sakenGjelder: {
    fnr: string;
    navn: string;
  };
}

interface LegacyVirksomhetView {
  navn: string;
  virksomhetsnummer: string;
}

export interface LegacyPartView {
  person: LegacyPersonView | null;
  virksomhet: LegacyVirksomhetView | null;
}

export interface LegacyPersonAndOppgaverResponse {
  fnr: string;
  navn: LegacyNavn;
  aapneBehandlinger: IOppgave[] | string[];
  avsluttedeBehandlinger: IOppgave[] | string[];
}

export interface LegacyNameSearchResponse {
  people: {
    fnr: string;
    navn: LegacyNavn;
  }[];
}
