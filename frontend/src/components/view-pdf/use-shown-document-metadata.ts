import type { IShownDocument } from '@app/components/view-pdf/types';
import {
  getAttachmentsOverviewInlineUrl,
  getJournalfoertDocumentInlineUrl,
  getNewDocumentInlineUrl,
} from '@app/domain/inline-document-url';
import {
  getAttachmentsOverviewTabId,
  getAttachmentsOverviewTabUrl,
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getNewDocumentTabId,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

export interface DocumentMetadata {
  inlineUrl: string;
  tabUrl: string;
  tabId: string;
}

export const useShownDocumentMetadata = (
  oppgaveId: string | typeof skipToken,
  showDocumentList: IShownDocument[],
): DocumentMetadata[] =>
  useMemo(() => {
    if (oppgaveId === skipToken) {
      return [];
    }

    return showDocumentList.flatMap((doc) => {
      const metadata = getDocumentMetadata(doc, oppgaveId);

      return metadata === undefined ? [] : [metadata];
    });
  }, [oppgaveId, showDocumentList]);

const getDocumentMetadata = (doc: IShownDocument, oppgaveId: string): DocumentMetadata | undefined => {
  if (doc.type === DocumentTypeEnum.JOURNALFOERT) {
    return {
      tabUrl: getJournalfoertDocumentTabUrl(doc.journalpostId, doc.dokumentInfoId),
      inlineUrl: getJournalfoertDocumentInlineUrl(doc.journalpostId, doc.dokumentInfoId),
      tabId: getJournalfoertDocumentTabId(doc.journalpostId, doc.dokumentInfoId),
    };
  }

  if (doc.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
    return {
      tabUrl: getAttachmentsOverviewTabUrl(oppgaveId, doc.documentId),
      inlineUrl: getAttachmentsOverviewInlineUrl(oppgaveId, doc.documentId),
      tabId: getAttachmentsOverviewTabId(doc.documentId),
    };
  }

  return {
    tabUrl: getNewDocumentTabUrl(oppgaveId, doc.documentId, doc.parentId),
    inlineUrl: getNewDocumentInlineUrl(oppgaveId, doc.documentId),
    tabId: getNewDocumentTabId(doc.documentId, doc.parentId),
  };
};
