import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { styled } from 'styled-components';
import { CreateText } from '@app/components/maltekstseksjoner/create';
import { AvailableTexts } from '@app/components/maltekstseksjoner/maltekstseksjon/draft/available-texts/available-texts';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { RichTextTypes } from '@app/types/common-text-types';
import { IGetTextsParams } from '@app/types/maltekstseksjoner/params';
import { IDraftMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { DragAndDropContext } from '../../drag-and-drop/drag-context';
import { List, SidebarContainer, StyledHeading } from '../common';
import { DraggableListItem } from './draggable-list-item';

interface Props {
  maltekstseksjon: IDraftMaltekstseksjon;
  query: IGetTextsParams;
}

enum DragDirection {
  NONE,
  UP,
  DOWN,
}

export const Sidebar = ({ maltekstseksjon, query }: Props) => {
  const [updateTextIdList] = useUpdateTextIdListMutation({ fixedCacheKey: maltekstseksjon.id });
  const [dragDirection, setDragDirection] = useState<DragDirection>(DragDirection.NONE);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { draggedTextId, clearDragState } = useContext(DragAndDropContext);

  const { id, textIdList } = maltekstseksjon;

  const draggedIndex = useMemo(
    () => (draggedTextId === null ? -1 : textIdList.indexOf(draggedTextId)),
    [draggedTextId, textIdList],
  );

  const hoveredIndex = useMemo(
    () => (hoveredId === null ? -1 : textIdList.indexOf(hoveredId)),
    [hoveredId, textIdList],
  );

  const onDragEnter = useCallback(
    (textId: string | null, index: number) => {
      setHoveredId(textId);

      if (draggedIndex === -1 || draggedIndex === index) {
        return setDragDirection(DragDirection.NONE);
      }

      return setDragDirection(draggedIndex < index ? DragDirection.DOWN : DragDirection.UP);
    },
    [draggedIndex],
  );

  const sortedTextIdList = useMemo(() => {
    if (draggedTextId === null || draggedIndex === -1 || hoveredIndex === -1 || dragDirection === DragDirection.NONE) {
      return textIdList;
    }

    const result = new Array<string>(textIdList.length);

    if (dragDirection === DragDirection.UP) {
      for (let i = textIdList.length - 1; i >= 0; i--) {
        if (i === hoveredIndex) {
          result[i] = draggedTextId;
        } else if (i > draggedIndex || i < hoveredIndex) {
          result[i] = textIdList.at(i)!;
        } else {
          result[i] = textIdList.at(i - 1)!;
        }
      }

      return result;
    }

    for (let i = textIdList.length - 1; i >= 0; i--) {
      if (i === hoveredIndex) {
        result[i] = draggedTextId;
      } else if (i < draggedIndex || i > hoveredIndex) {
        result[i] = textIdList.at(i)!;
      } else {
        result[i] = textIdList.at(i + 1) ?? textIdList.at(0)!;
      }
    }

    return result;
  }, [dragDirection, draggedIndex, draggedTextId, hoveredIndex, textIdList]);

  const { textId: addAfter } = useParams();

  const onAddText = useCallback(
    (textId: string) => {
      const index = typeof addAfter === 'string' ? textIdList.indexOf(addAfter) : -1;
      const newTextIdList = [...textIdList];
      newTextIdList.splice(index + 1, 0, textId);
      updateTextIdList({ id, query, textIdList: newTextIdList });
    },
    [addAfter, id, query, textIdList, updateTextIdList],
  );

  const onRemoveText = useCallback(
    (textId: string) => {
      updateTextIdList({ id, query, textIdList: textIdList.filter((_id) => _id !== textId) });
    },
    [id, query, textIdList, updateTextIdList],
  );

  return (
    <SidebarContainer>
      <List>
        {sortedTextIdList.map((textId, index) => (
          <DraggableListItem
            key={textId}
            textId={textId}
            maltekst={maltekstseksjon}
            query={query}
            onDragEnter={() => onDragEnter(textIdList.at(index)!, index)}
            onDrop={() => {
              if (dragDirection === DragDirection.NONE) {
                return;
              }
              updateTextIdList({ id, query, textIdList: sortedTextIdList });
              clearDragState();
              setHoveredId(null);
            }}
          />
        ))}
      </List>

      <ButtonsContainer>
        <StyledHeading level="1" size="xsmall">
          Ny tekst
        </StyledHeading>
        <CreateText query={query} textType={RichTextTypes.MALTEKST} maltekstseksjon={maltekstseksjon} />
        <CreateText query={query} textType={RichTextTypes.REDIGERBAR_MALTEKST} maltekstseksjon={maltekstseksjon} />

        <StyledHeading level="1" size="xsmall">
          Eksisterende tekster
        </StyledHeading>
        <AvailableTexts
          onAdd={onAddText}
          onRemove={onRemoveText}
          usedIds={maltekstseksjon.textIdList}
          textType={RichTextTypes.MALTEKST}
        />
        <AvailableTexts
          onAdd={onAddText}
          onRemove={onRemoveText}
          usedIds={maltekstseksjon.textIdList}
          textType={RichTextTypes.REDIGERBAR_MALTEKST}
        />
      </ButtonsContainer>
    </SidebarContainer>
  );
};

const ButtonsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, min-content);
  margin-top: 8px;
  align-items: center;
`;
