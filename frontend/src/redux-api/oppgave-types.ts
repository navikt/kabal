import { ISettMedunderskriverResponse } from './medunderskrivere';
import { IKlagebehandling, IVedlegg, Utfall } from './oppgave-state-types';

export interface IKlagebehandlingUpdate {
  klagebehandlingId: string;
  hjemler: string[];
  klagebehandlingVersjon: number;
  tilknyttedeDokumenter: IDocumentReference[];
  utfall: Utfall | null;
}

export interface IDocumentReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface IKlagebehandlingOppdateringResponse {
  klagebehandlingVersjon: number;
  modified: string;
}

export interface IVedleggResponse {
  modified: string;
  klagebehandlingVersjon: number;
  file: IVedlegg | null;
}

export interface IVedtakFullfoertResponse {
  klagebehandlingVersjon: number;
  modified: string; // LocalDateTime;
  ferdigstilt: string; // LocalDateTime;
  avsluttetAvSaksbehandler: string; // LocalDate;
}

export interface IMedunderskriverSatt extends ISettMedunderskriverResponse {
  medunderskriverident: string;
}

export interface FullforVedtakProps {
  skjult: boolean;
  klagebehandling: IKlagebehandling;
}
