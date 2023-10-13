import React, { createContext, useCallback, useState } from 'react';
import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { IMainDocument } from '@app/types/documents/documents';

interface IDragAndDropContext {
  draggedJournalfoertDocuments: IArkivertDocument[];
  setDraggedJournalfoertDocuments: (documents: IArkivertDocument[]) => void;
  draggedDocument: IMainDocument | null;
  setDraggedDocument: (document: IMainDocument | null) => void;
  clearDragState: () => void;
  draggingEnabled: boolean;
  setDraggingEnabled: (enabled: boolean) => void;
}

export const DragAndDropContext = createContext<IDragAndDropContext>({
  draggedJournalfoertDocuments: [],
  setDraggedJournalfoertDocuments: () => {},
  draggedDocument: null,
  setDraggedDocument: () => {},
  clearDragState: () => {},
  draggingEnabled: true,
  setDraggingEnabled: () => {},
});

interface Props {
  children: React.ReactNode;
}

const EMPTY_ARRAY: IArkivertDocument[] = [];

export const DragAndDropContextElement = ({ children }: Props) => {
  const [draggedJournalfoertDocuments, setDraggedJournalfoertDocuments] = useState<IArkivertDocument[]>(EMPTY_ARRAY);
  const [draggedDocument, setDraggedDocument] = useState<IMainDocument | null>(null);
  const [draggingEnabled, setDraggingEnabled] = useState(true);

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
        draggingEnabled,
        setDraggingEnabled,
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
};
