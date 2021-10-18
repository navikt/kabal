import { useCallback } from 'react';
import { useRemoveTilknyttetDocumentMutation, useTilknyttDocumentMutation } from '../redux-api/oppgave';
import { ITilknyttDocumentParams } from '../redux-api/oppgave-types';

export const useCheckDocument = (
  klagebehandlingId: string,
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
        klagebehandlingId,
      };

      if (checked) {
        tilknyttDocument(data);
      } else {
        removeDocument(data);
      }
    },
    [klagebehandlingId, dokumentInfoId, journalpostId, tilknyttDocument, removeDocument]
  );

  const isLoading = tilknyttLoader.isLoading || removeLoader.isLoading;

  return [onCheck, isLoading];
};
