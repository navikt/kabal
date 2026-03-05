import { PositionedBookmarks } from '@app/components/smart-editor/bookmarks/positioned';
import { NumberOfComments } from '@app/components/smart-editor/comments/number-of-comments';
import { PositionedComments } from '@app/components/smart-editor/comments/positioned-comments';
import { useAnnotationsCounts } from '@app/components/smart-editor/comments/use-annotations-counts';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useContext } from 'react';

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
