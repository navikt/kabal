import { useCallback } from 'react';
import { useRemoveTilknyttetDocumentMutation, useTilknyttDocumentMutation } from '../redux-api/oppgave';

export const useCheckDocument = (
  klagebehandlingId: string,
  dokumentInfoId: string,
  journalpostId: string
): [(checked: boolean) => void, boolean] => {
  const [tilknyttDocument, tilknyttLoader] = useTilknyttDocumentMutation();
  const [removeDocument, removeLoader] = useRemoveTilknyttetDocumentMutation();

  const onCheck = useCallback(
    (checked: boolean) => {
      if (checked) {
        tilknyttDocument({
          dokumentInfoId,
          journalpostId,
          klagebehandlingId,
        });
      } else {
        removeDocument({
          dokumentInfoId,
          klagebehandlingId,
        });
      }
    },
    [klagebehandlingId, dokumentInfoId, journalpostId, tilknyttDocument, removeDocument]
  );

  const isLoading = tilknyttLoader.isLoading || removeLoader.isLoading;

  return [onCheck, isLoading];
};
