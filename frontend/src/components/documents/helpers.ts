interface ComparableDokument {
  dokumentInfoId: string | null;
  journalpostId: string;
  valgt: boolean;
}

export const dokumentMatcher = (a: ComparableDokument, b: ComparableDokument): boolean =>
  a.dokumentInfoId === b.dokumentInfoId && a.journalpostId === b.journalpostId && a.valgt === b.valgt;
