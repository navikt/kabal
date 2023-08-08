import React, { createContext, useCallback, useState } from 'react';
import { useLazyGetDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IJournalpostReference } from '@app/types/documents/documents';
import { getId } from './helpers';
import { useSelectMany } from './select-many';
import { useSelectOne } from './select-one';
import { useSelectRangeTo } from './select-range-to';
import { ISelectContext, ISelectedDocument, SelectedMap } from './types';

export const SelectContext = createContext<ISelectContext>({
  selectedDocuments: {},
  lastSelectedDocument: null,
  isSelected: () => false,
  selectOne: () => {},
  unselectOne: () => {},
  selectMany: () => {},
  unselectMany: () => {},
  selectRangeTo: () => {},
  unselectAll: () => {},
  getSelectedDocuments: async () => [],
});

interface Props {
  children: React.ReactNode;
  documentList: IJournalpostReference[];
}

export const SelectContextElement = ({ children, documentList }: Props) => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedMap>({});
  const [lastSelectedDocument, setLastSelectedDocument] = useState<ISelectedDocument | null>(null);

  const [getDocument] = useLazyGetDocumentQuery();

  const selectOne = useSelectOne(setSelectedDocuments, setLastSelectedDocument);
  const selectMany = useSelectMany(setSelectedDocuments, setLastSelectedDocument);
  const selectRangeTo = useSelectRangeTo(
    setSelectedDocuments,
    setLastSelectedDocument,
    documentList,
    lastSelectedDocument,
  );

  const unselectOne = useCallback((document: ISelectedDocument) => {
    setLastSelectedDocument(null);
    setSelectedDocuments((map) => {
      delete map[getId(document)];

      return { ...map };
    });
  }, []);

  const unselectAll = useCallback(() => {
    setLastSelectedDocument(null);
    setSelectedDocuments({});
  }, []);

  const unselectMany = useCallback((documents: ISelectedDocument[]) => {
    setLastSelectedDocument(null);
    setSelectedDocuments((map) => {
      documents.forEach((document) => {
        delete map[getId(document)];
      });

      return { ...map };
    });
  }, []);

  const isSelected = useCallback(
    (document: ISelectedDocument) => Object.hasOwn(selectedDocuments, getId(document)),
    [selectedDocuments],
  );

  return (
    <SelectContext.Provider
      value={{
        selectedDocuments,
        lastSelectedDocument,
        selectOne,
        unselectOne,
        selectMany,
        unselectMany,
        selectRangeTo,
        unselectAll,
        isSelected,
        getSelectedDocuments: async () => {
          const documents = Object.values(selectedDocuments);

          if (documents.length === 0) {
            return [];
          }

          return Promise.all(documents.map((document) => getDocument(document, true).unwrap()));
        },
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};
