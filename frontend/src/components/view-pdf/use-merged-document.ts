import { canOpenInKabal } from '@app/components/documents/filetype';
import { useMergedDocumentsReferenceQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import type { IShownArchivedDocument, IShownDocument } from './types';

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
