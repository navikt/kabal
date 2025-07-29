import { TextListItem } from '@app/components/maltekstseksjoner/text-list-item';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { DragAndDropContext } from '../../drag-and-drop/drag-context';
import { LoadTextListItem } from '../list-item';

interface DraggableListItemProps {
  textId: string;
  maltekst: IMaltekstseksjon;
  onDragEnter: () => void;
  onDrop: () => void;
  query: IGetMaltekstseksjonParams;
}

export const DraggableListItem = ({ textId, maltekst, onDragEnter, onDrop, query }: DraggableListItemProps) => {
  const { textId: activeTextId } = useParams<{ textId: string }>();
  const { draggedTextId } = useContext(DragAndDropContext);

  const cancelDragEvent = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isDragging = draggedTextId === textId;

  return (
    <TextListItem
      isActive={draggedTextId === null && textId === activeTextId}
      isDragging={isDragging}
      onDragEnter={(e) => {
        cancelDragEvent(e);
        onDragEnter();
      }}
      onDragOver={cancelDragEvent}
      onDrop={onDrop}
    >
      <LoadTextListItem textId={textId} maltekstseksjon={maltekst} query={query} />
    </TextListItem>
  );
};
