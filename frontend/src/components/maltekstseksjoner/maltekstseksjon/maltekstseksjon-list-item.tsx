import { isDraft } from '@app/components/smart-editor-texts/functions/status-helpers';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import type { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { useCallback, useContext } from 'react';
import { DragAndDropContext } from '../drag-and-drop/drag-context';
import { useDragState } from '../drag-and-drop/use-drag-state';
import { ListItem } from '../styled-components';

interface MaltekstListItemProps {
  maltekstseksjon: IMaltekstseksjon;
  activeId: string | undefined;
  query: IGetMaltekstseksjonParams;
  children: React.ReactNode;
}

export const MaltekstseksjontListItem = ({ maltekstseksjon, activeId, query, children }: MaltekstListItemProps) => {
  const [updateTextIdList] = useUpdateTextIdListMutation({ fixedCacheKey: maltekstseksjon.id });
  const { draggedTextId, clearDragState } = useContext(DragAndDropContext);
  const { isDragOver, onDragEnter, onDragLeave } = useDragState();

  const { id, textIdList, title } = maltekstseksjon;

  const onDrop = useCallback(() => {
    if (draggedTextId === null) {
      return;
    }

    updateTextIdList({ id, textIdList: [...textIdList, draggedTextId], query });
    clearDragState();
  }, [clearDragState, draggedTextId, id, query, textIdList, updateTextIdList]);

  return (
    <ListItem
      $isActive={id === activeId}
      $isDropTarget={isDraft(maltekstseksjon) && draggedTextId !== null && !textIdList.includes(draggedTextId)}
      $isDragOver={isDragOver}
      draggable={false}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onDragStart={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      data-dragovertext={`Legg til «${title}»`}
    >
      {children}
    </ListItem>
  );
};
