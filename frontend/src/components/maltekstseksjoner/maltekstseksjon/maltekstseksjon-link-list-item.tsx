import { useContext } from 'react';
import { DragAndDropContext } from '@/components/maltekstseksjoner/drag-and-drop/drag-context';
import { useDragState } from '@/components/maltekstseksjoner/drag-and-drop/use-drag-state';
import { MaltekstseksjonListItem } from '@/components/maltekstseksjoner/maltekstseksjon-list-item';
import { isDraft } from '@/components/smart-editor-texts/functions/status-helpers';
import { useUpdateTextIdListMutation } from '@/redux-api/maltekstseksjoner/mutations';
import { useGetMaltekstseksjonQuery } from '@/redux-api/maltekstseksjoner/queries';
import type { IGetMaltekstseksjonParams } from '@/types/maltekstseksjoner/params';

interface MaltekstListItemProps {
  maltekstseksjonId: string;
  activeId: string | undefined;
  query: IGetMaltekstseksjonParams;
  children: React.ReactNode;
}

export const MaltekstseksjontLinkListItem = ({
  maltekstseksjonId,
  activeId,
  query,
  children,
}: MaltekstListItemProps) => {
  const { data: maltekstseksjon } = useGetMaltekstseksjonQuery(maltekstseksjonId);
  const [updateTextIdList] = useUpdateTextIdListMutation({ fixedCacheKey: maltekstseksjonId });
  const { draggedTextId, clearDragState } = useContext(DragAndDropContext);
  const { isDragOver, onDragEnter, onDragLeave } = useDragState();

  if (maltekstseksjon === undefined) {
    return null;
  }

  const { id, textIdList, title } = maltekstseksjon;

  const onDrop = () => {
    if (draggedTextId === null) {
      return;
    }

    updateTextIdList({ id, textIdList: [...textIdList, draggedTextId], query });
    clearDragState();
  };

  return (
    <MaltekstseksjonListItem
      isActive={id === activeId}
      isDropTarget={isDraft(maltekstseksjon) && draggedTextId !== null && !textIdList.includes(draggedTextId)}
      isDragOver={isDragOver}
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
      dragOverText={`Legg til «${title}»`}
    >
      {children}
    </MaltekstseksjonListItem>
  );
};
