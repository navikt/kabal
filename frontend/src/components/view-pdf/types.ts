import { DocumentTypeEnum } from '@app/types/documents/documents';

interface IShownNewDocument {
  documentId: string;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED;
}

export interface IShownArchivedDocument {
  dokumentInfoId: string;
  journalpostId: string;
  type: DocumentTypeEnum.JOURNALFOERT;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
