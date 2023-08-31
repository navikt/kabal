import { IJournalfoertDokument, IJournalfoertDokumentReference, IMainDocument } from '@app/types/documents/documents';

export interface ICreateVedleggFromJournalfoertDocumentResponse {
  addedJournalfoerteDokumenter: IJournalfoertDokumentReference[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokument[];
}

export interface ISetParentResponse {
  alteredDocuments: IMainDocument[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokumentReference[];
}
