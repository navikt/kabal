import { useCallback } from 'react';
import { getId } from './helpers';
import { ISelectedDocument, SelectHook, SelectOne } from './types';

export const useSelectOne: SelectHook<SelectOne> = (setSelectedDocuments, setLastSelectedDocument) =>
  useCallback(
    (document: ISelectedDocument) => {
      setLastSelectedDocument(document);
      setSelectedDocuments((map) => ({
        ...map,
        [getId(document)]: document,
      }));
    },
    [setLastSelectedDocument, setSelectedDocuments],
  );
