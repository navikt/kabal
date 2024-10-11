import { findDocument } from '@app/domain/find-document';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { createContext, useCallback, useState } from 'react';
import { getId } from './helpers';
import { useSelectMany } from './select-many';
import { useSelectOne } from './select-one';
import { useSelectRangeTo } from './select-range-to';
import type { ISelectContext, SelectedMap } from './types';

export const SelectContext = createContext<ISelectContext>({
  selectedDocuments: new Map(),
  selectedCount: 0,
  lastSelectedDocument: null,
  isSelected: () => false,
  selectOne: () => {},
  unselectOne: () => {},
  selectMany: () => {},
  unselectMany: () => {},
  selectRangeTo: () => {},
  unselectAll: () => {},
  getSelectedDocuments: () => [],
});

interface Props {
  children: React.ReactNode;
  documentList: IArkivertDocument[];
}

export const SelectContextElement = ({ children, documentList }: Props) => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedMap>(new Map());
  const [lastSelectedDocument, setLastSelectedDocument] = useState<IJournalfoertDokumentId | null>(null);

  const selectOne = useSelectOne(setSelectedDocuments, setLastSelectedDocument, documentList);
  const selectMany = useSelectMany(setSelectedDocuments, setLastSelectedDocument, documentList);
  const selectRangeTo = useSelectRangeTo(
    setSelectedDocuments,
    setLastSelectedDocument,
    documentList,
    lastSelectedDocument,
  );

  const unselectOne = useCallback((document: IJournalfoertDokumentId) => {
    setLastSelectedDocument(null);
    setSelectedDocuments((map) => {
      map.delete(getId(document));

      return new Map(map);
    });
  }, []);

  const unselectAll = useCallback(() => {
    setLastSelectedDocument(null);
    setSelectedDocuments(new Map());
  }, []);

  const unselectMany = useCallback((documents: IJournalfoertDokumentId[]) => {
    setLastSelectedDocument(null);
    setSelectedDocuments((map) => {
      for (const document of documents) {
        map.delete(getId(document));
      }

      return new Map(map);
    });
  }, []);

  const isSelected = useCallback(
    (document: IJournalfoertDokumentId) => selectedDocuments.has(getId(document)),
    [selectedDocuments],
  );

  const getSelectedDocuments = useCallback(() => {
    if (selectedDocuments.size === 0) {
      return [];
    }

    const selectedDocumentsArray: IArkivertDocument[] = new Array<IArkivertDocument>(selectedDocuments.size);

    let index = 0;
    for (const [, { journalpostId, dokumentInfoId }] of selectedDocuments) {
      const doc = findDocument(journalpostId, dokumentInfoId, documentList);

      if (doc !== undefined) {
        selectedDocumentsArray[index] = doc;
      }

      index++;
    }

    return selectedDocumentsArray;
  }, [documentList, selectedDocuments]);

  return (
    <SelectContext.Provider
      value={{
        selectedDocuments,
        selectedCount: selectedDocuments.size,
        lastSelectedDocument,
        selectOne,
        unselectOne,
        selectMany,
        unselectMany,
        selectRangeTo,
        unselectAll,
        isSelected,
        getSelectedDocuments,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
};
