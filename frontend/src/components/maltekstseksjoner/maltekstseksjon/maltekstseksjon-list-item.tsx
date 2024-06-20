import { TasklistIcon } from '@navikt/aksel-icons';
import { useCallback, useContext } from 'react';
import { useMaltekstseksjonPath } from '@app/hooks/use-navigate-maltekstseksjoner';
import { useRedaktoerLanguage } from '@app/hooks/use-redaktoer-language';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { IGetMaltekstseksjonParams } from '@app/types/maltekstseksjoner/params';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { DragAndDropContext } from '../drag-and-drop/drag-context';
import { useDragState } from '../drag-and-drop/use-drag-state';
import { ListItem } from '../styled-components';
import { TextLink } from '../text-link';

interface MaltekstListItemProps {
  maltekstseksjon: IMaltekstseksjon;
  activeId: string | undefined;
  query: IGetMaltekstseksjonParams;
}

export const MaltekstseksjontListItem = ({ maltekstseksjon, activeId, query }: MaltekstListItemProps) => {
  const [updateTextIdList] = useUpdateTextIdListMutation({ fixedCacheKey: maltekstseksjon.id });
  const { draggedTextId, clearDragState } = useContext(DragAndDropContext);
  const { isDragOver, onDragEnter, onDragLeave } = useDragState();
  const lang = useRedaktoerLanguage();

  const { id, versionId, textIdList, title, modified, published, publishedDateTime } = maltekstseksjon;
  const textId = textIdList.at(0);

  const path = useMaltekstseksjonPath({ maltekstseksjonId: id, maltekstseksjonVersionId: versionId, textId, lang });

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
      $isDropTarget={draggedTextId !== null && !textIdList.includes(draggedTextId)}
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
      <TextLink
        key={id}
        to={path}
        modified={modified}
        icon={<TasklistIcon aria-hidden />}
        publishedDateTime={publishedDateTime}
        published={published}
      >
        {title}
      </TextLink>
    </ListItem>
  );
};
