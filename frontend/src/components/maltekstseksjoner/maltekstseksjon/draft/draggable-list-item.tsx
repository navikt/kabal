import { useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { DragAndDropContext } from '../../drag-and-drop/drag-context';
import { TextListItem } from '../../styled-components';
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

  const cancelDragEvent = useCallback((e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isDragging = draggedTextId === textId;

  return (
    <TextListItem
      data-isactive={(draggedTextId === null && textId === activeTextId).toString()}
      data-isdragging={isDragging.toString()}
      $isActive={draggedTextId === null && textId === activeTextId}
      $isDragging={isDragging}
      onDragEnter={(e) => {
        cancelDragEvent(e);
        onDragEnter();
      }}
      onDragOver={cancelDragEvent}
      onDrop={onDrop}
      data-dragovertext=""
    >
      <LoadTextListItem textId={textId} maltekstseksjon={maltekst} query={query} />
    </TextListItem>
  );
};
