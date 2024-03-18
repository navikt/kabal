import { useContext, useMemo } from 'react';
import { useThreads } from '@app/components/smart-editor/comments/use-threads';
import { SmartEditorContext } from '@app/components/smart-editor/context';

export const useAnnotationsCounts = () => {
  const { attached, orphans } = useThreads();
  const { bookmarksMap } = useContext(SmartEditorContext);

  const bookmarksCount = useMemo(() => Object.keys(bookmarksMap).length, [bookmarksMap]);

  return {
    attached: attached.length,
    orphans: orphans.length,
    bookmarks: bookmarksCount,
  };
};
