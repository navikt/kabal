import type { Variants } from '@app/types/arkiverte-documents';
import type { DocumentTypeEnum } from '@app/types/documents/documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

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

/** Only a new (in-progress) document is being viewed, identified by its ID. */
interface INewDocumentPdfViewed {
  readonly newDocument: string;
  readonly archivedFiles?: never;
  readonly vedleggsoversikt?: never;
}

/** One or more archived (journalførte) documents are being viewed, identified by their compound key. */
interface IArchivedFilesPdfViewed {
  readonly newDocument?: never;
  readonly archivedFiles: readonly IJournalfoertDokumentId[];
  readonly vedleggsoversikt?: never;
}

/** A vedleggsoversikt (virtual attachment overview) is being viewed, identified by its parent document ID. */
interface IVedleggsoversiktPdfViewed {
  readonly newDocument?: never;
  readonly archivedFiles?: never;
  readonly vedleggsoversikt: string;
}

/**
 * Stored data structure for which documents are currently viewed in the PDF panel.
 *
 * Only one variant can be active at a time.
 * The union enforces this mutual exclusivity at the type level.
 */
export type IFilesViewed = INewDocumentPdfViewed | IArchivedFilesPdfViewed | IVedleggsoversiktPdfViewed;
