import type { Bookmark } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import { BOOKMARK_VARIANT_TO_CLASSNAME, isBookmarkVariant } from '@app/plate/toolbar/bookmark-button';
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
      className={bookmark === undefined ? undefined : `${BOOKMARK_VARIANT_TO_CLASSNAME[bookmark.variant]} rounded-sm`}
      data-selected={leaf.selected}
      attributes={{ ...props.attributes, suppressContentEditableWarning: true }}
    >
      {children}
    </PlateLeaf>
  );
};

const useBookmarks = (leaf: FormattedText) =>
  useMemo(() => {
    const bookmarks: Omit<Bookmark, 'nodes'>[] = [];

    const entries = Object.entries(leaf);

    for (const [key, variant] of entries) {
      if (key.startsWith(BOOKMARK_PREFIX)) {
        if (typeof variant !== 'string' || !isBookmarkVariant(variant)) {
          continue;
        }

        bookmarks.push({ key, variant });
      }
    }

    return bookmarks;
  }, [leaf]);
