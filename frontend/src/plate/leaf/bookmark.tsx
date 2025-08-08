import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { BOOKMARK_ID_TO_COLOR, LEGACY_COLOR_TO_NEW } from '@app/plate/toolbar/bookmark-button';
import type { FormattedText } from '@app/plate/types';
import { PlateLeaf, type PlateLeafProps } from 'platejs/react';
import { useMemo } from 'react';

export const BookmarkLeaf = (props: PlateLeafProps<FormattedText>) => {
  const { leaf, children } = props;
  const bookmarks = useBookmarks(leaf);

  const [bookmark] = bookmarks;

  return (
    <PlateLeaf
      {...props}
      className={bookmark?.color}
      data-selected={leaf.selected}
      attributes={{ ...props.attributes, suppressContentEditableWarning: true }}
    >
      {children}
    </PlateLeaf>
  );
};

const useBookmarks = (leaf: FormattedText) =>
  useMemo(() => {
    const bookmarks: { key: string; color: string }[] = [];

    const keys = Object.keys(leaf);

    for (const key of keys) {
      if (key.startsWith(BOOKMARK_PREFIX)) {
        const bookmarkId = leaf[key];

        if (typeof bookmarkId !== 'string') {
          continue;
        }

        const color = BOOKMARK_ID_TO_COLOR[bookmarkId] ?? LEGACY_COLOR_TO_NEW[bookmarkId];

        if (color !== undefined) {
          bookmarks.push({ key, color });
        }
      }
    }

    return bookmarks;
  }, [leaf]);
