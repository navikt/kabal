import { createContext, useCallback, useState } from 'react';

interface IDragAndDropContext {
  draggedTextId: string | null;
  setDraggedTextId: (textId: string | null) => void;
  clearDragState: () => void;
  draggingEnabled: boolean;
  setDraggingEnabled: (enabled: boolean) => void;
}

export const DragAndDropContext = createContext<IDragAndDropContext>({
  draggedTextId: '',
  setDraggedTextId: () => undefined,
  clearDragState: () => undefined,
  draggingEnabled: true,
  setDraggingEnabled: () => undefined,
});

interface Props {
  children: React.ReactNode;
}

export const DragAndDropContextElement = ({ children }: Props) => {
  const [draggedTextId, setDraggedTextId] = useState<string | null>(null);
  const [draggingEnabled, setDraggingEnabled] = useState(true);

  const clearDragState = useCallback(() => {
    setDraggedTextId(null);
  }, []);

  return (
    <DragAndDropContext.Provider
      value={{
        draggedTextId,
        setDraggedTextId,
        clearDragState,
        draggingEnabled,
        setDraggingEnabled,
      }}
    >
      {children}
    </DragAndDropContext.Provider>
  );
};
