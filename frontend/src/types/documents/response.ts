import { IJournalfoertDokumentReference } from '@app/types/documents/documents';
import { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export interface ICreateVedleggFromJournalfoertDocumentResponse {
  addedJournalfoerteDokumenter: IJournalfoertDokumentReference[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokumentId[];
}

interface AlteredDocument extends IModifiedDocumentResonse {
  id: string;
  parentId: string;
}

export interface ISetParentResponse extends IModifiedDocumentResonse {
  alteredDocuments: AlteredDocument[];
  duplicateJournalfoerteDokumenter: string[];
}

export interface IModifiedDocumentResonse {
  modified: string;
}
