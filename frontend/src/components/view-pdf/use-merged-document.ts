import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { canOpenInKabal } from '@/components/documents/filetype';
import type { IShownArchivedDocument, IShownDocument } from '@/components/view-pdf/types';
import { useMergedDocumentsReferenceQuery } from '@/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@/types/documents/documents';

export const useMergedDocument = (showDocumentList: IShownDocument[]) => {
  const archivedDocuments = useMemo(() => showDocumentList.filter(shouldMerge), [showDocumentList]);

  const param = archivedDocuments.length > 1 ? archivedDocuments : skipToken;
  const { data, isLoading, isFetching, isError } = useMergedDocumentsReferenceQuery(param);

  if (param === skipToken) {
    return {
      mergedDocumentIsError: false,
      mergedDocumentIsLoading: false,
      mergedDocument: undefined,
    };
  }

  return {
    mergedDocumentIsError: isError,
    mergedDocumentIsLoading: isLoading || isFetching,
    mergedDocument: data,
  };
};

const shouldMerge = (showDocument: IShownDocument): showDocument is IShownArchivedDocument =>
  showDocument.type === DocumentTypeEnum.JOURNALFOERT && canOpenInKabal(showDocument.varianter);
