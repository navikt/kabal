export interface IDbDokument {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string | null;
  tema: string | null;
  registrert: string; // LocalDate
  harTilgangTilArkivvariant: number;
}

export interface IDokument {
  journalpostId: string;
  dokumentInfoId: string;
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
