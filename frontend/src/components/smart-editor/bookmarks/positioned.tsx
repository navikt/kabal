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
import { BoxNew, Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo, useState } from 'react';

const ITEM_WIDTH = 1.5;
const ITEM_GAP = 0.2;
const ITEM_OFFSET = ITEM_WIDTH + ITEM_GAP;

const FONT_SIZE = `calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt)`;

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
    <section
      className="relative"
      style={{
        width: `${maxCount * ITEM_WIDTH + (maxCount - 1) * ITEM_GAP}em`,
        fontSize: FONT_SIZE,
        gridArea: 'bookmarks',
      }}
    >
      {positionedItems.map(({ data, top, floorIndex }) => (
        <Bookmark
          key={data.id}
          bookmark={data}
          style={{ top: `${top}em`, left: `${floorIndex * ITEM_OFFSET}em` }}
          onDelete={onDelete}
        />
      ))}
    </section>
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
      <BoxNew
        as="button"
        type="button"
        position="absolute"
        borderRadius="medium"
        height="1.5em"
        width="1.5em"
        key={id}
        onClick={() => onDelete(id)}
        onMouseEnter={() => sethover(true)}
        onMouseLeave={() => sethover(false)}
        style={{ ...style, color }}
        className="z-1 flex cursor-pointer items-center justify-center text-[length:inherit]"
      >
        {hover ? (
          <TrashFillIcon aria-hidden width="100%" height="100%" />
        ) : (
          <BookmarkFillIcon aria-hidden width="100%" height="100%" />
        )}
      </BoxNew>
    </Tooltip>
  );
};
