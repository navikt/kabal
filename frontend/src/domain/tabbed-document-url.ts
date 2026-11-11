import { encodeArchivedDocumentIds, getArchivedFileViewerUrl } from '@/domain/file-viewer-url';
import type { IJournalfoertDokumentId } from '@/types/oppgave-common';

// File viewer URL functions (new /file-viewer/ paths)
export const getNewFileViewerTabUrl = (oppgaveId: string, documentId: string, _parentId: string | null) =>
  `/file-viewer/dua/${oppgaveId}/${documentId}`;

export const getJournalfoertFileViewerTabUrl = (behandlingId: string, journalpostId: string, dokumentInfoId: string) =>
  getArchivedFileViewerUrl(behandlingId, `${journalpostId}:${dokumentInfoId}`);

export const getCombinedFileViewerTabUrl = (behandlingId: string, documents: readonly IJournalfoertDokumentId[]) =>
  getArchivedFileViewerUrl(behandlingId, encodeArchivedDocumentIds(documents));

export const getCombinedFileViewerTabId = (documents: readonly IJournalfoertDokumentId[]) =>
  `combined-document-${encodeArchivedDocumentIds(documents)}`;

export const getAttachmentsOverviewFileViewerTabUrl = (oppgaveId: string, documentId: string) =>
  `/file-viewer/dua/${oppgaveId}/${documentId}/vedleggsoversikt`;

// Document URL functions (legacy paths from 0465deb)
export const getNewDocumentTabUrl = (oppgaveId: string, documentId: string, parentId: string | null) =>
  parentId === null ? `/nytt-dokument/${oppgaveId}/${documentId}` : `/nytt-dokumentvedlegg/${oppgaveId}/${documentId}`;

export const getJournalfoertDocumentTabUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/arkivert-dokument/${journalpostId}/${dokumentInfoId}`;

export const getMergedDocumentTabUrl = (mergedDocumentId: string) => `/kombinert-dokument/${mergedDocumentId}`;

export const getNewDocumentTabId = (documentId: string, parentId: string | null) =>
  parentId === null ? `new-document-${documentId}` : `new-document-attachment-${documentId}`;

export const getJournalfoertDocumentTabId = (journalpostId: string, dokumentInfoId: string) =>
  `archived-document-${journalpostId}-${dokumentInfoId}`;

export const getMergedDocumentTabId = (mergedDocumentId: string) => `combined-document-${mergedDocumentId}`;

export const getAttachmentsOverviewTabUrl = (oppgaveId: string, documentId: string) =>
  `/vedleggsoversikt/${oppgaveId}/${documentId}`;

export const getAttachmentsOverviewTabId = (documentId: string) => `attachments-overview-${documentId}`;
