import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useCallback } from 'react';
import { useRemoveTilknyttetDocumentMutation } from '@app/redux-api/oppgaver/mutations/remove-tilknytt-document';
import { useTilknyttDocumentMutation } from '@app/redux-api/oppgaver/mutations/tilknytt-document';

export const useCheckDocument = (
  oppgaveId: string | typeof skipToken,
  dokumentInfoId: string,
  journalpostId: string,
): [(checked: boolean) => void, boolean] => {
  const [tilknyttDocument, tilknyttLoader] = useTilknyttDocumentMutation();
  const [removeDocument, removeLoader] = useRemoveTilknyttetDocumentMutation();

  const onCheck = useCallback(
    (checked: boolean) => {
      if (oppgaveId === skipToken) {
        return;
      }

      return (checked ? tilknyttDocument : removeDocument)({
        dokumentInfoId,
        journalpostId,
        oppgaveId,
      });
    },
    [oppgaveId, dokumentInfoId, journalpostId, tilknyttDocument, removeDocument],
  );

  const isLoading = tilknyttLoader.isLoading || removeLoader.isLoading;

  return [onCheck, isLoading];
};
