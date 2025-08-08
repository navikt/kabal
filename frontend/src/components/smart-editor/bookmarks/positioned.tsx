import { type Bookmark, useBookmarks } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import {
  getPositionedItems,
  type ItemToPosition,
  type PositionedItem,
} from '@app/components/smart-editor/functions/get-positioned-items';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { pushEvent } from '@app/observability';
import { BASE_FONT_SIZE } from '@app/plate/components/get-scaled-em';
import { BOOKMARK_VARIANT_TO_CLASSNAME } from '@app/plate/toolbar/bookmark-button';
import { useMyPlateEditorRef } from '@app/plate/types';
import { BookmarkFillIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BoxNew, Tooltip } from '@navikt/ds-react';
import { useCallback, useContext, useMemo } from 'react';

const ITEM_WIDTH = 6 * 4;
const ITEM_GAP = 4;

const FONT_SIZE = `calc(var(${EDITOR_SCALE_CSS_VAR}) * ${BASE_FONT_SIZE}pt)`;

export const PositionedBookmarks = () => {
  const { sheetRef } = useContext(SmartEditorContext);
  const bookmarksList = useBookmarks();
  const editorRef = useMyPlateEditorRef();

  interface Positioned {
    positionedItems: PositionedItem<Bookmark>[];
    maxCount: number;
  }

  const { positionedItems, maxCount } = useMemo<Positioned>(() => {
    const bookmarks = bookmarksList.map<ItemToPosition<Bookmark>>((bookmark) => ({
      key: bookmark.key,
      data: bookmark,
    }));

    return getPositionedItems(editorRef, bookmarks, sheetRef.current);
  }, [bookmarksList, editorRef, sheetRef]);

  const onDelete = useCallback(
    (key: string) => {
      pushEvent('remove-bookmark', 'smart-editor');
      editorRef.tf.setNodes({ [key]: undefined }, { match: (n) => key in n, mode: 'lowest', at: [] });
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
        width: `${maxCount * ITEM_WIDTH + (maxCount - 1) * ITEM_GAP}px`,
        fontSize: FONT_SIZE,
        gridArea: 'bookmarks',
      }}
    >
      {positionedItems.map(({ data, top, floorIndex }) => (
        <BookmarkItem
          key={data.key}
          bookmark={data}
          style={{
            top: `calc(${top + 0.85}em - ${ITEM_WIDTH / 2}px)`,
            left: `${floorIndex * ITEM_WIDTH + floorIndex * ITEM_GAP}px`,
          }}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

interface BookmarkProps {
  bookmark: Bookmark;
  style?: React.CSSProperties;
  onDelete: (key: string) => void;
}

const BookmarkItem = ({ bookmark, style, onDelete }: BookmarkProps) => {
  const { key, variant, nodes } = bookmark;
  const [node] = nodes;

  if (node === undefined) {
    return null;
  }

  const className = BOOKMARK_VARIANT_TO_CLASSNAME[variant];

  return (
    <Tooltip content="Fjern bokmerke" placement="top">
      <BoxNew
        as="button"
        type="button"
        position="absolute"
        borderRadius="medium"
        key={key}
        onClick={() => onDelete(key)}
        style={style}
        className={`group/bookmark z-1 flex h-6 w-6 cursor-pointer items-center justify-center ${className}`}
      >
        <XMarkIcon
          aria-hidden
          width="100%"
          height="100%"
          className="absolute top-0 left-0 opacity-0 group-hover/bookmark:opacity-100"
        />
        <BookmarkFillIcon
          aria-hidden
          width="100%"
          height="100%"
          className="absolute top-0 left-0 opacity-100 group-hover/bookmark:opacity-0"
        />
      </BoxNew>
    </Tooltip>
  );
};
