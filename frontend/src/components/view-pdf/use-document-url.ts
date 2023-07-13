import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useMemo } from 'react';
import { KABAL_API_BASE_PATH, KABAL_BEHANDLINGER_BASE_PATH } from '@app/redux-api/common';
import { useMergedDocumentsReferenceQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { IShownArchivedDocument, IShownDocument } from './types';

const UNINITIALIZED = {
  data: undefined,
  isLoading: false,
  error: undefined,
  isError: false,
  isUninitialized: true,
};

export const useDocumentUrl = (oppgaveId: string | typeof skipToken, showDocumentList: IShownDocument[]) => {
  const archivedDocuments = useMemo(() => showDocumentList.filter(isArchivedDocument), [showDocumentList]);

  const mergedDocumentsReference = useMergedDocumentsReferenceQuery(
    archivedDocuments.length > 1 ? archivedDocuments : skipToken
  );

  if (showDocumentList.length === 1) {
    const [showDocument] = showDocumentList;

    if (showDocument === undefined || oppgaveId === skipToken) {
      return UNINITIALIZED;
    }

    switch (showDocument.type) {
      case DocumentTypeEnum.JOURNALFOERT: {
        const { dokumentInfoId, journalpostId } = showDocument;

        return {
          data: `${KABAL_API_BASE_PATH}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`,
          error: undefined,
          isLoading: false,
          isError: false,
          isUninitialized: false,
        };
      }
      case DocumentTypeEnum.SMART:
      case DocumentTypeEnum.UPLOADED: {
        return {
          data: `${KABAL_BEHANDLINGER_BASE_PATH}/${oppgaveId}/dokumenter/${showDocument.documentId}/pdf`,
          error: undefined,
          isLoading: false,
          isError: false,
          isUninitialized: false,
        };
      }
    }
  }

  if (mergedDocumentsReference.isError) {
    return mergedDocumentsReference;
  }

  if (mergedDocumentsReference.isLoading || typeof mergedDocumentsReference.data === 'undefined') {
    return mergedDocumentsReference;
  }

  return {
    ...mergedDocumentsReference,
    data: `${KABAL_API_BASE_PATH}/journalposter/mergedocuments/${mergedDocumentsReference.data.reference}/pdf`,
  };
};

const isArchivedDocument = (showDocument: IShownDocument): showDocument is IShownArchivedDocument =>
  showDocument.type === DocumentTypeEnum.JOURNALFOERT;
