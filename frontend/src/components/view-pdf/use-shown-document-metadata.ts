import type { IShownDocument } from '@app/components/view-pdf/types';
import {
  getAttachmentsOverviewInlineUrl,
  getJournalfoertDocumentInlineUrl,
  getMergedDocumentInlineUrl,
  getMergedDuaDocumentInlineUrl,
  getNewDocumentInlineUrl,
} from '@app/domain/inline-document-url';
import {
  getAttachmentsOverviewTabId,
  getAttachmentsOverviewTabUrl,
  getJournalfoertDocumentTabId,
  getJournalfoertDocumentTabUrl,
  getMergedDocumentTabId,
  getMergedDocumentTabUrl,
  getMergedDuaDocumentTabId,
  getMergedDuaDocumentTabUrl,
  getNewDocumentTabId,
  getNewDocumentTabUrl,
} from '@app/domain/tabbed-document-url';
import { DocumentTypeEnum, type IMergedDocumentsResponse } from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';

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

    if (onlyDocument.type === DocumentTypeEnum.SMART) {
      return {
        tabUrl: getMergedDuaDocumentTabUrl(oppgaveId, onlyDocument.documentId),
        inlineUrl: getMergedDuaDocumentInlineUrl(oppgaveId, onlyDocument.documentId),
        tabId: getMergedDuaDocumentTabId(onlyDocument.documentId),
      };
    }

    return {
      tabUrl: getNewDocumentTabUrl(oppgaveId, onlyDocument.documentId),
      inlineUrl: getNewDocumentInlineUrl(oppgaveId, onlyDocument.documentId),
      tabId: getNewDocumentTabId(onlyDocument.documentId),
    };
  }, [mergedDocument, oppgaveId, showDocumentList]);
