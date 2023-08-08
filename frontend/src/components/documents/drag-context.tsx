import React, { createContext, useCallback, useState } from 'react';
import { IJournalpostDocument } from '@app/types/arkiverte-documents';
import { IMainDocument } from '@app/types/documents/documents';

interface IDragAndDropContext {
  draggedJournalfoertDocuments: IJournalpostDocument[];
  setDraggedJournalfoertDocuments: (documents: IJournalpostDocument[]) => void;
  draggedDocument: IMainDocument | null;
  setDraggedDocument: (document: IMainDocument | null) => void;
  clearDragState: () => void;
}

export const DragAndDropContext = createContext<IDragAndDropContext>({
  draggedJournalfoertDocuments: [],
  setDraggedJournalfoertDocuments: () => {},
  draggedDocument: null,
  setDraggedDocument: () => {},
  clearDragState: () => {},
});

interface Props {
  children: React.ReactNode;
}

const EMPTY_ARRAY: IJournalpostDocument[] = [];

export const DragAndDropContextElement = ({ children }: Props) => {
  const [draggedJournalfoertDocuments, setDraggedJournalfoertDocuments] = useState<IJournalpostDocument[]>(EMPTY_ARRAY);
  const [draggedDocument, setDraggedDocument] = useState<IMainDocument | null>(null);

  const hasDocument = draggedDocument !== null;
  const hasJournalfoertDocuments = draggedJournalfoertDocuments.length !== 0;

  const clearDragState = useCallback(() => {
    if (hasJournalfoertDocuments) {
      setDraggedJournalfoertDocuments(EMPTY_ARRAY);
    }

    if (hasDocument) {
      setDraggedDocument(null);
    }
  }, [hasJournalfoertDocuments, hasDocument]);

  return (
    <DragAndDropContext.Provider
      value={{
        draggedJournalfoertDocuments,
        setDraggedJournalfoertDocuments,
        draggedDocument,
        setDraggedDocument,
        clearDragState,
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
};
