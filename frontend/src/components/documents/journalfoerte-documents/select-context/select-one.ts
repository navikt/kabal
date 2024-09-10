import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { useCallback } from 'react';
import { getId } from './helpers';
import type { SelectHook, SelectOne } from './types';

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
