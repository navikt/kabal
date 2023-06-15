import { IJournalfoertDokumentId, IJournalfoertDokumentReference, IMainDocument } from '@app/types/documents/documents';

export interface ICreateVedleggFromJournalfoertDocumentResponse {
  addedJournalfoerteDokumenter: IJournalfoertDokumentReference[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokumentId[];
}

export interface ISetParentResponse {
  alteredDocuments: IMainDocument[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokumentReference[];
}
