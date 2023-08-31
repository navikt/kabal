import { useCallback } from 'react';
import { getId } from './helpers';
import { IArkivertDocumentReference, SelectHook, SelectOne } from './types';

export const useSelectOne: SelectHook<SelectOne> = (setSelectedDocuments, setLastSelectedDocument) =>
  useCallback(
    (documentIds: IArkivertDocumentReference) => {
      setLastSelectedDocument(documentIds);

      setSelectedDocuments((map) => {
        map.set(getId(documentIds), documentIds);

        return new Map(map);
      });
    },
    [setLastSelectedDocument, setSelectedDocuments],
  );
