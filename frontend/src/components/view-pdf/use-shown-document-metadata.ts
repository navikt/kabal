import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { IShownDocument } from '@app/components/view-pdf/types';
import {
  getAttachmentsOverviewInlineUrl,
  getJournalfoertDocumentInlineUrl,
  getMergedDocumentInlineUrl,
  getNewDocumentInlineUrl,
} from '@app/domain/inline-document-url';
import {
  getAttachmentsOverviewTabId,
  getAttachmentsOverviewTabUrl,
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getMergedDocumentTabId,
  getMergedDocumentTabUrl,
  getNewDocumentTabId,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { DocumentTypeEnum, IMergedDocumentsResponse } from '@app/types/documents/documents';

type DocumentData =
  | { inlineUrl: string; tabUrl: string; tabId: string }
  | { inlineUrl: undefined; tabUrl: undefined; tabId: undefined };

export const useShownDocumentMetadata = (
  oppgaveId: string | typeof skipToken,
  mergedDocument: IMergedDocumentsResponse | undefined,
  showDocumentList: IShownDocument[],
) =>
  useMemo<DocumentData>(() => {
    if (mergedDocument !== undefined) {
      return {
        tabUrl: getMergedDocumentTabUrl(mergedDocument.reference),
        inlineUrl: getMergedDocumentInlineUrl(mergedDocument.reference),
        tabId: getMergedDocumentTabId(mergedDocument.reference),
      };
    }

    const [onlyDocument] = showDocumentList;

    if (onlyDocument === undefined || oppgaveId === skipToken) {
      return { tabUrl: undefined, inlineUrl: undefined, tabId: undefined };
    }

    if (onlyDocument.type === DocumentTypeEnum.JOURNALFOERT) {
      return {
        tabUrl: getJournalfoertDocumentTabUrl(onlyDocument.journalpostId, onlyDocument.dokumentInfoId),
        inlineUrl: getJournalfoertDocumentInlineUrl(onlyDocument.journalpostId, onlyDocument.dokumentInfoId),
        tabId: getJournalfoertDocumentTabId(onlyDocument.journalpostId, onlyDocument.dokumentInfoId),
      };
    }

    if (onlyDocument.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
      return {
        tabUrl: getAttachmentsOverviewTabUrl(oppgaveId, onlyDocument.documentId),
        inlineUrl: getAttachmentsOverviewInlineUrl(oppgaveId, onlyDocument.documentId),
        tabId: getAttachmentsOverviewTabId(onlyDocument.documentId),
      };
    }

    return {
      tabUrl: getNewDocumentTabUrl(oppgaveId, onlyDocument.documentId),
      inlineUrl: getNewDocumentInlineUrl(oppgaveId, onlyDocument.documentId),
      tabId: getNewDocumentTabId(onlyDocument.documentId),
    };
  }, [mergedDocument, oppgaveId, showDocumentList]);
