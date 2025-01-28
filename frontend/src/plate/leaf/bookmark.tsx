import { BOOKMARK_PREFIX } from '@app/components/smart-editor/constants';
import type { FormattedText } from '@app/plate/types';
import { PlateLeaf, type PlateLeafProps } from '@udecode/plate-common/react';
import { useMemo } from 'react';

export const BookmarkLeaf = (props: PlateLeafProps<FormattedText>) => {
  const { leaf, children } = props;
  const bookmarks = useBookmarks(leaf);

  return (
    <PlateLeaf
      {...props}
      style={{ color: bookmarks[0]?.color }}
      data-selected={leaf.selected}
      suppressContentEditableWarning
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
        const bookmarkColor = leaf[key];

        if (typeof bookmarkColor === 'string') {
          bookmarks.push({ key, color: bookmarkColor });
        }
      }
    }

    return bookmarks;
  }, [leaf]);
