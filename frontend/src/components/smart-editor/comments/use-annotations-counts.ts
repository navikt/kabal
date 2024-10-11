import { useBookmarks } from '@app/components/smart-editor/bookmarks/use-bookmarks';
import { useThreads } from '@app/components/smart-editor/comments/use-threads';
import { useMemo } from 'react';

export const useAnnotationsCounts = () => {
  const { attached, orphans } = useThreads();
  const bookmarksList = useBookmarks();

  const bookmarksCount = useMemo(() => bookmarksList.length, [bookmarksList]);

  return {
    attached: attached.length,
    orphans: orphans.length,
    bookmarks: bookmarksCount,
  };
};
