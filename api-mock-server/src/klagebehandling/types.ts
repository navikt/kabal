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
  klagerFoedselsnummer: string | null;
  klagerKjoenn: string | null;
  klagerNavn: INavn | null;
  klagerVirksomhetsnavn: string | null;
  klagerVirksomhetsnummer: string | null;
  kommentarFraFoersteinstans: string | null;
  medunderskriverident: string | null;
  modified: string; // LocalDateTime
  mottatt: string | null; // LocalDate
  mottattFoersteinstans: string | null; // LocalDate
  mottattKlageinstans: string | null; // LocalDate
  raadfoertMedLege: string | null;
  sakenGjelderFoedselsnummer: string | null;
  sakenGjelderKjoenn: string | null;
  sakenGjelderNavn: INavn | null;
  sakenGjelderVirksomhetsnavn: string | null;
  sakenGjelderVirksomhetsnummer: string | null;
  sendTilbakemelding: boolean | null;
  tema: string;
  tilbakemelding: string | null;
  tildelt: string | null; // LocalDate
  tildeltSaksbehandlerident: string | null;
  type: string;
  vedtak: Array<Vedtak>;
  tilknyttedeDokumenter: TilknyttetDokument[];
}

export interface TilknyttetDokument {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface Vedtak {
  brevMottakere: IBrevMottaker[];
  ferdigstilt: string | null; // LocalDateTime
  file: IVedlegg | null;
  grunn: string | null;
  hjemler: string[];
  id: string;
  opplastet: string | null; // LocalDateTime
  utfall: string | null;
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

export interface INavn {
  fornavn?: string;
  mellomnavn?: string;
  etternavn?: string;
}

export interface IVedlegg {
  name: string;
  size: number;
  opplastet: string | null; // LocalDateTime
}

export interface Editerbare {
  klagebehandlingId: string;
  klagebehandlingVersjon: number;
  internVurdering: string;
  grunn: string | null;
  utfall: string | null;
  hjemler: string[];
  tilknyttedeDokumenter: TilknyttetDokument[];
}
