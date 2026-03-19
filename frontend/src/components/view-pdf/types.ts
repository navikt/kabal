import type { Variants } from '@/types/arkiverte-documents';
import type { DocumentTypeEnum } from '@/types/documents/documents';
import type { IJournalfoertDokumentId } from '@/types/oppgave-common';

interface IShownNewDocument {
  documentId: string;
  parentId: string | null;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.UPLOADED | DocumentTypeEnum.VEDLEGGSOVERSIKT;
}

export interface IShownArchivedDocument extends IJournalfoertDokumentId {
  type: DocumentTypeEnum.JOURNALFOERT;
  varianter: Variants;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
