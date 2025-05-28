import { useAnnotationsCounts } from '@app/components/smart-editor/comments/use-annotations-counts';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useContext } from 'react';
import { PositionedBookmarks } from '../bookmarks/positioned';
import { NumberOfComments } from '../comments/number-of-comments';
import { PositionedComments } from '../comments/positioned-comments';

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
