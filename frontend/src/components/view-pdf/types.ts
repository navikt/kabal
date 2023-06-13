import { DocumentTypeEnum, IJournalfoertDokumentReference } from '@app/types/documents/documents';

interface IShownNewDocument {
  documentId: string;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED;
}

export interface IShownArchivedDocument extends IJournalfoertDokumentReference {
  type: DocumentTypeEnum.JOURNALFOERT;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
