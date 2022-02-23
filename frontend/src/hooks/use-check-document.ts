import { useCallback } from 'react';
import { useRemoveTilknyttetDocumentMutation, useTilknyttDocumentMutation } from '../redux-api/oppgavebehandling';

export const useCheckDocument = (
  oppgaveId: string,
  dokumentInfoId: string,
  journalpostId: string,
  pageReferences: (string | null)[],
  temaer: string[]
): [(checked: boolean) => void, boolean] => {
  const [tilknyttDocument, tilknyttLoader] = useTilknyttDocumentMutation();
  const [removeDocument, removeLoader] = useRemoveTilknyttetDocumentMutation();

  const onCheck = useCallback(
    (checked: boolean) =>
      (checked ? tilknyttDocument : removeDocument)({
        dokumentInfoId,
        journalpostId,
        oppgaveId,
        pageReferences,
        temaer,
      }),
    [oppgaveId, dokumentInfoId, journalpostId, pageReferences, temaer, tilknyttDocument, removeDocument]
  );

  const isLoading = tilknyttLoader.isLoading || removeLoader.isLoading;

  return [onCheck, isLoading];
};
