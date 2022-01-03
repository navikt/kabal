import { useCallback } from 'react';
import { useRemoveTilknyttetDocumentMutation, useTilknyttDocumentMutation } from '../redux-api/oppgavebehandling';
import { ITilknyttDocumentParams } from '../types/oppgavebehandling-params';
import { useOppgaveType } from './use-oppgave-type';

export const useCheckDocument = (
  klagebehandlingId: string,
  dokumentInfoId: string,
  journalpostId: string
): [(checked: boolean) => void, boolean] => {
  const [tilknyttDocument, tilknyttLoader] = useTilknyttDocumentMutation();
  const [removeDocument, removeLoader] = useRemoveTilknyttetDocumentMutation();
  const type = useOppgaveType();

  const onCheck = useCallback(
    (checked: boolean) => {
      const data: ITilknyttDocumentParams = {
        dokumentInfoId,
        journalpostId,
        oppgaveId: klagebehandlingId,
        type,
      };

      if (checked) {
        tilknyttDocument({ ...data, type });
      } else {
        removeDocument({ ...data, type });
      }
    },
    [klagebehandlingId, dokumentInfoId, journalpostId, tilknyttDocument, removeDocument, type]
  );

  const isLoading = tilknyttLoader.isLoading || removeLoader.isLoading;

  return [onCheck, isLoading];
};
