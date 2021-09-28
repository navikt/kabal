export interface IDokumentParams {
  id: string;
  idx: number;
  handling: string;
  antall: number;
  ref: string | null;
  historyNavigate: boolean;
}

export interface IDokumenterRespons {
  dokumenter: IDokument[];
  pageReference: string | null;
  antall: number;
  totaltAntall: number;
}

export interface IDokumenterParams {
  klagebehandlingId: string;
  pageReference: string | null;
  temaFilter: string[] | undefined;
}

export interface IDokument {
  journalpostId: string;
  dokumentInfoId: string; // nullable?
  tittel: string | null;
  tema: string | null;
  registrert: string; // LocalDate
  harTilgangTilArkivvariant: boolean;
  vedlegg: IDokumentVedlegg[];
}

export interface IDokumentVedlegg {
  dokumentInfoId: string;
  tittel: string | null;
  harTilgangTilArkivvariant: boolean;
}
