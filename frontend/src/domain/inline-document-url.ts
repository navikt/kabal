import {
  getAttachmentsOverviewTabUrl,
  getJournalfoertDocumentTabUrl,
  getMergedDocumentTabUrl,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';

export const getNewDocumentInlineUrl = (oppgaveId: string, documentId: string, parentId: string | null) =>
  `/inline${getNewDocumentTabUrl(oppgaveId, documentId, parentId)}`;

export const getJournalfoertDocumentInlineUrl = (journalpostId: string, dokumentInfoId: string) =>
  `/inline${getJournalfoertDocumentTabUrl(journalpostId, dokumentInfoId)}`;

export const getMergedDocumentInlineUrl = (mergedDocumentId: string) =>
  `/inline${getMergedDocumentTabUrl(mergedDocumentId)}`;

export const getAttachmentsOverviewInlineUrl = (oppgaveId: string, documentId: string) =>
  `/inline${getAttachmentsOverviewTabUrl(oppgaveId, documentId)}`;
