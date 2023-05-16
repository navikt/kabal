export interface IDocumentReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface ISaksbehandler {
  navIdent: string;
  navn: string;
}

export interface IMedunderskriver {
  navIdent: string;
  navn: string;
}

export interface IVedlegg {
  name: string;
  size: number;
  opplastet: string | null; // LocalDateTime
}

export interface IPerson {
  navn: string | null;
  fnr: string;
}
