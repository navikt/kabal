import { useBookmarks } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import {
  type BookmarkData,
  getPositionedItems,
  ItemType,
  type PositionedItem,
} from '@app/components/smart-editor/functions/get-positioned-items';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { pushEvent } from '@app/observability';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { useMyPlateEditorRef } from '@app/plate/types';
import { BookmarkFillIcon, TrashFillIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useState } from 'react';
import { styled } from 'styled-components';

const ITEM_WIDTH = 1.5;
const ITEM_GAP = 0.2;
const ITEM_OFFSET = ITEM_WIDTH + ITEM_GAP;

export const PositionedBookmarks = () => {
  const { sheetRef } = useContext(SmartEditorContext);
  const bookmarksList = useBookmarks();
  const editorRef = useMyPlateEditorRef();

  interface Positioned {
    positionedItems: PositionedItem<BookmarkData>[];
    maxCount: number;
  }

  const { positionedItems, maxCount } = useMemo<Positioned>(() => {
    const bookmarks = bookmarksList.map<BookmarkData>(([key, value]) => ({
      id: key,
      nodes: value,
      type: ItemType.BOOKMARK,
    }));

    return getPositionedItems(editorRef, bookmarks, sheetRef.current);
  }, [bookmarksList, editorRef, sheetRef]);

  const onDelete = useCallback(
    (id: string) => {
      pushEvent('remove-bookmark', 'smart-editor');
      editorRef.tf.setNodes({ [id]: undefined }, { match: (n) => id in n, mode: 'lowest', at: [] });
    },
    [editorRef],
  );

  if (positionedItems.length === 0) {
    return null;
  }

  return (
    <Container style={{ width: `${maxCount * ITEM_WIDTH + (maxCount - 1) * ITEM_GAP}em` }}>
      {positionedItems.map(({ data, top, floorIndex }) => (
        <Bookmark
          key={data.id}
          bookmark={data}
          style={{ top: `${top}em`, left: `${floorIndex * ITEM_OFFSET}em` }}
          onDelete={onDelete}
        />
      ))}
    </Container>
  );
};

interface BookmarkProps {
  bookmark: BookmarkData;
  style?: React.CSSProperties;
  onDelete: (id: string) => void;
}

const Bookmark = ({ bookmark, style, onDelete }: BookmarkProps) => {
  const [hover, sethover] = useState(false);
  const { id, nodes } = bookmark;
  const [node] = nodes;

  if (node === undefined) {
    return null;
  }

  const color = node[id];

  if (typeof color !== 'string') {
    return null;
  }

  return (
    <Tooltip content="Fjern bokmerke" placement="top">
      <BookmarkItem
        key={id}
        style={style}
        onClick={() => onDelete(id)}
        $color={color}
        onMouseEnter={() => sethover(true)}
        onMouseLeave={() => sethover(false)}
      >
        {hover ? (
          <TrashFillIcon aria-hidden width="100%" height="100%" />
        ) : (
          <BookmarkFillIcon aria-hidden width="100%" height="100%" />
        )}
      </BookmarkItem>
    </Tooltip>
  );
};

const BookmarkItem = styled.button<{ $color: string }>`
  cursor: pointer;
  position: absolute;
  z-index: 1;
  border: none;
  border-radius: var(--a-border-radius-medium);
  background-color: transparent;
  color: ${({ $color }) => $color};
  height: 1.5em;
  width: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: inherit;
`;

const Container = styled.section`
  grid-area: bookmarks;
  position: relative;
  font-size: calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt);
`;
