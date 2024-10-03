import { JournalfoertDokument } from '@app/types/documents/documents';
import { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export interface ICreateVedleggFromJournalfoertDocumentResponse {
  addedJournalfoerteDokumenter: JournalfoertDokument[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokumentId[];
}

interface AlteredDocument extends IModifiedDocumentResponse {
  id: string;
  parentId: string;
}

export interface ISetParentResponse extends IModifiedDocumentResponse {
  alteredDocuments: AlteredDocument[];
  duplicateJournalfoerteDokumenter: string[];
}

export interface IModifiedDocumentResponse {
  modified: string;
}
