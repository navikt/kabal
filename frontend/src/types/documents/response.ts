import { IJournalfoertDokument, IJournalfoertDokumentReference, IMainDocument } from '@app/types/documents/documents';

export interface ICreateVedleggFromJournalfoertDocumentResponse {
  addedJournalfoerteDokumenter: IJournalfoertDokument[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokumentReference[];
}

export interface ISetParentResponse {
  alteredDocuments: IMainDocument[];
  duplicateJournalfoerteDokumenter: IJournalfoertDokument[];
}
