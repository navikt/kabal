import { useCallback } from 'react';
import { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { getId } from './helpers';
import { SelectHook, SelectOne } from './types';

export const useSelectOne: SelectHook<SelectOne> = (setSelectedDocuments, setLastSelectedDocument) =>
  useCallback(
    (documentIds: IJournalfoertDokumentId) => {
      setLastSelectedDocument(documentIds);

      setSelectedDocuments((map) => {
        map.set(getId(documentIds), documentIds);

        return new Map(map);
      });
    },
    [setLastSelectedDocument, setSelectedDocuments],
  );
