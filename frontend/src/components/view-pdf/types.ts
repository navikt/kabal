import { DocumentTypeEnum, IJournalfoertDokumentId } from '@app/types/documents/documents';

interface IShownNewDocument {
  documentId: string;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED | DocumentTypeEnum.VEDLEGGSOVERSIKT;
}

export interface IShownArchivedDocument extends IJournalfoertDokumentId {
  type: DocumentTypeEnum.JOURNALFOERT;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
