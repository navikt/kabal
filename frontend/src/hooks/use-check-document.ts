import { useCallback } from 'react';
import { useRemoveTilknyttetDocumentMutation, useTilknyttDocumentMutation } from '../redux-api/oppgavebehandling';
import { ITilknyttDocumentParams } from '../types/oppgavebehandling-params';

export const useCheckDocument = (
  oppgavebehandlingId: string,
  dokumentInfoId: string,
  journalpostId: string
): [(checked: boolean) => void, boolean] => {
  const [tilknyttDocument, tilknyttLoader] = useTilknyttDocumentMutation();
  const [removeDocument, removeLoader] = useRemoveTilknyttetDocumentMutation();

  const onCheck = useCallback(
    (checked: boolean) => {
      const data: ITilknyttDocumentParams = {
        dokumentInfoId,
        journalpostId,
        oppgaveId: oppgavebehandlingId,
      };

      if (checked) {
        tilknyttDocument(data);
      } else {
        removeDocument(data);
      }
    },
    [oppgavebehandlingId, dokumentInfoId, journalpostId, tilknyttDocument, removeDocument]
  );

  const isLoading = tilknyttLoader.isLoading || removeLoader.isLoading;

  return [onCheck, isLoading];
};
