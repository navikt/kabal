import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback } from 'react';
import { useRemoveTilknyttedeDocumentsMutation } from '@/redux-api/oppgaver/mutations/remove-tilknytt-document';
import { useTilknyttDocumentsMutation } from '@/redux-api/oppgaver/mutations/tilknytt-document';

export const useCheckDocument = (
  oppgaveId: string | typeof skipToken,
  dokumentInfoId: string,
  journalpostId: string,
): [(checked: boolean) => void, boolean] => {
  const [tilknyttDocuments, tilknyttLoader] = useTilknyttDocumentsMutation();
  const [removeDocuments, removeLoader] = useRemoveTilknyttedeDocumentsMutation();

  const onCheck = useCallback(
    (checked: boolean) => {
      if (oppgaveId === skipToken) {
        return;
      }

      return (checked ? tilknyttDocuments : removeDocuments)({
        oppgaveId,
        documentIdList: [{ dokumentInfoId, journalpostId }],
      });
    },
    [oppgaveId, dokumentInfoId, journalpostId, tilknyttDocuments, removeDocuments],
  );

  const isLoading = tilknyttLoader.isLoading || removeLoader.isLoading;

  return [onCheck, isLoading];
};
