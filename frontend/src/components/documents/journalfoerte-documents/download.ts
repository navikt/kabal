import { getJournalfoertDocumentInlineUrl } from '@app/domain/inline-document-url';
import type { Variants } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export interface DownloadableDocument extends IJournalfoertDokumentId {
  tittel: string;
  varianter: Variants;
}

export const downloadDocuments = (...documents: DownloadableDocument[]) => {
  const downloadLink = window.document.createElement('a');

  for (const { journalpostId, dokumentInfoId, tittel } of documents) {
    downloadLink.href = getJournalfoertDocumentInlineUrl(journalpostId, dokumentInfoId);
    downloadLink.download = tittel ?? journalpostId;
    downloadLink.click();
  }
};
