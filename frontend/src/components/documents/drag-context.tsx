import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IDocument } from '@app/types/documents/documents';
import { createContext, useCallback, useState } from 'react';

interface IDragAndDropContext {
  draggedJournalfoertDocuments: IArkivertDocument[];
  setDraggedJournalfoertDocuments: (documents: IArkivertDocument[]) => void;
  draggedDocument: IDocument | null;
  setDraggedDocument: (document: IDocument | null) => void;
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
  const [draggedDocument, setDraggedDocument] = useState<IDocument | null>(null);
  const [draggingEnabled, setDraggingEnabled] = useState(true);

  const clearDragState = useCallback(() => {
    setDraggedJournalfoertDocuments(EMPTY_ARRAY);
    setDraggedDocument(null);
  }, []);

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
