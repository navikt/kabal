import { encodeArchivedDocumentIds } from '@app/domain/file-viewer-url';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export const getNewDocumentTabUrl = (oppgaveId: string, documentId: string, _parentId: string | null) =>
  `/file-viewer/dua/${oppgaveId}/${documentId}`;

export const getJournalfoertDocumentTabUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/file-viewer/archived/${journalpostId}:${dokumentInfoId}`;

export const getCombinedDocumentTabUrl = (documents: readonly IJournalfoertDokumentId[]) =>
  `/file-viewer/archived/${encodeArchivedDocumentIds(documents)}`;

export const getNewDocumentTabId = (documentId: string, parentId: string | null) =>
  parentId === null ? `new-document-${documentId}` : `new-document-attachment-${documentId}`;

export const getJournalfoertDocumentTabId = (journalpostId: string, dokumentInfoId: string) =>
  `archived-document-${journalpostId}-${dokumentInfoId}`;

export const getCombinedDocumentTabId = (documents: readonly IJournalfoertDokumentId[]) =>
  `combined-document-${encodeArchivedDocumentIds(documents)}`;

export const getAttachmentsOverviewTabUrl = (oppgaveId: string, documentId: string) =>
  `/file-viewer/dua/${oppgaveId}/${documentId}/vedleggsoversikt`;

export const getAttachmentsOverviewTabId = (documentId: string) => `attachments-overview-${documentId}`;
