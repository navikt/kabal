import { useCallback } from 'react';
import { getId } from './helpers';
import { useSelectOne } from './select-one';
import { ISelectedDocument, SelectHook, SelectMany } from './types';

export const useSelectMany: SelectHook<SelectMany> = (setSelectedDocuments, setLastSelectedDocument) => {
  const selectOne = useSelectOne(setSelectedDocuments, setLastSelectedDocument);

  return useCallback(
    (documents: ISelectedDocument[]) => {
      if (documents.length === 0) {
        return;
      }

      if (documents.length === 1 && documents[0] !== undefined) {
        selectOne(documents[0]);

        return;
      }

      setLastSelectedDocument(null);
      setSelectedDocuments((map) => {
        documents.forEach((document) => {
          map[getId(document)] = document;
        });

        return { ...map };
      });
    },
    [selectOne, setLastSelectedDocument, setSelectedDocuments]
  );
};
