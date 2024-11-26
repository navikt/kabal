import { CreateText } from '@app/components/maltekstseksjoner/create';
import { AvailableTexts } from '@app/components/maltekstseksjoner/maltekstseksjon/draft/available-texts/available-texts';
import { useUpdateTextIdListMutation } from '@app/redux-api/maltekstseksjoner/mutations';
import { type IGetMaltekstseksjonParams, RichTextTypes } from '@app/types/common-text-types';
import type { IDraftMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';
import { Heading, VStack } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { DragAndDropContext } from '../../drag-and-drop/drag-context';
import { List, SidebarContainer } from '../common';
import { DraggableListItem } from './draggable-list-item';

interface Props {
  maltekstseksjon: IDraftMaltekstseksjon;
  query: IGetMaltekstseksjonParams;
}

enum DragDirection {
  NONE = 0,
  UP = 1,
  DOWN = 2,
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

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: ¯\_(ツ)_/¯
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
          const value = textIdList.at(i);
          if (value !== undefined) {
            result[i] = value;
          }
        } else {
          const prevValue = textIdList.at(i - 1);
          if (prevValue !== undefined) {
            result[i] = prevValue;
          }
        }
      }

      return result;
    }

    for (let i = textIdList.length - 1; i >= 0; i--) {
      if (i === hoveredIndex) {
        result[i] = draggedTextId;
      } else if (i < draggedIndex || i > hoveredIndex) {
        const value = textIdList.at(i);
        if (value !== undefined) {
          result[i] = value;
        }
      } else {
        const nextValue = textIdList.at(i + 1);
        if (nextValue !== undefined) {
          result[i] = nextValue;
          continue;
        }

        const value = textIdList.at(i);
        if (value !== undefined) {
          result[i] = value;
        }
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
            onDragEnter={() => {
              const textId = textIdList.at(index);

              if (textId === undefined) {
                return;
              }

              onDragEnter(textId, index);
            }}
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

      <VStack as="section" gap="2" marginBlock="2 0" width="100%">
        <Heading level="1" size="xsmall">
          Legg til tekst i denne maltekstseksjonen
        </Heading>

        <CreateText query={query} textType={RichTextTypes.MALTEKST} maltekstseksjon={maltekstseksjon} />
        <CreateText query={query} textType={RichTextTypes.REDIGERBAR_MALTEKST} maltekstseksjon={maltekstseksjon} />

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
      </VStack>
    </SidebarContainer>
  );
};
