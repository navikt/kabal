import type { JournalfoertDokument } from '@/types/documents/documents';
import type { IJournalfoertDokumentId } from '@/types/oppgave-common';

export interface ICreateVedleggResponse {
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

export const UPLOAD_FILE_ERROR: Record<string, string> = {
  TOO_LARGE: 'Filen er for stor.',
  EMPTY: 'Filen er tom.',
  VIRUS: 'Filen inneholder virus.',
};
