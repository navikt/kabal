export interface IArkiverteDocumentsResponse {
  dokumenter: IArkivertDocument[];
  pageReference: string | null;
  antall: number;
  totaltAntall: number;
}

export interface IArkivertDocument {
  journalpostId: string;
  dokumentInfoId: string; // nullable?
  tittel: string | null;
  tema: string | null;
  registrert: string; // LocalDate
  harTilgangTilArkivvariant: boolean;
  vedlegg: IArkivertDocumentVedlegg[];
}

export interface IArkivertDocumentVedlegg {
  dokumentInfoId: string;
  tittel: string | null;
  harTilgangTilArkivvariant: boolean;
}
