export interface IGetDokumenterParams {
  klagebehandlingId: string;
  pageReference: string | null;
  temaer: string[];
  pageSize: number;
}

export interface IDokumentParams {
  id: string;
  idx: number;
  handling: string;
  antall: number;
  ref: string | null;
  historyNavigate: boolean;
}

export interface IDocumentsResponse {
  dokumenter: IDocument[];
  pageReference: string | null;
  antall: number;
  totaltAntall: number;
}

export interface IDokumenterParams {
  klagebehandlingId: string;
  pageReference: string | null;
  temaFilter: string[] | undefined;
}

export interface IDocument {
  journalpostId: string;
  dokumentInfoId: string; // nullable?
  tittel: string | null;
  tema: string | null;
  registrert: string; // LocalDate
  harTilgangTilArkivvariant: boolean;
  vedlegg: IDocumentVedlegg[];
}

export interface IDocumentVedlegg {
  dokumentInfoId: string;
  tittel: string | null;
  harTilgangTilArkivvariant: boolean;
}
