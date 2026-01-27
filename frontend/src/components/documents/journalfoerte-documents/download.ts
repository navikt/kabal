import { getJournalfoertDocumentFileUrl } from '@app/domain/file-url';
import type { Variants } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export interface DownloadableDocument extends IJournalfoertDokumentId {
  tittel: string;
  varianter: Variants;
}

export const downloadDocuments = (...documents: DownloadableDocument[]) => {
  const downloadLink = window.document.createElement('a');

  for (const { journalpostId, dokumentInfoId, tittel } of documents) {
    downloadLink.href = getJournalfoertDocumentFileUrl(journalpostId, dokumentInfoId);
    downloadLink.download = tittel ?? journalpostId;
    downloadLink.click();
  }
};
