import { useContext } from 'react';
import { PositionedBookmarks } from '@/components/smart-editor/bookmarks/positioned';
import { NumberOfComments } from '@/components/smart-editor/comments/number-of-comments';
import { PositionedComments } from '@/components/smart-editor/comments/positioned-comments';
import { useAnnotationsCounts } from '@/components/smart-editor/comments/use-annotations-counts';
import { SmartEditorContext } from '@/components/smart-editor/context';

export const PositionedRight = () => {
  const { attached, orphans, bookmarks } = useAnnotationsCounts();
  const { editingComment } = useContext(SmartEditorContext);

  if (attached === 0 && orphans === 0 && bookmarks === 0 && editingComment === null) {
    return null;
  }

  return (
    <>
      <NumberOfComments />
      <PositionedBookmarks />
      <PositionedComments />
    </>
  );
};
