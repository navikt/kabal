import type { DocumentTypeEnum } from '@app/types/documents/documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

interface IShownNewDocument {
  documentId: string;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED | DocumentTypeEnum.VEDLEGGSOVERSIKT;
}

export interface IShownArchivedDocument extends IJournalfoertDokumentId {
  type: DocumentTypeEnum.JOURNALFOERT;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
