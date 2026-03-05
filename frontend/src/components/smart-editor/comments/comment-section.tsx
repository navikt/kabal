import { ThreadList } from '@app/components/smart-editor/comments/thread-list';
import { useThreads } from '@app/components/smart-editor/comments/use-threads';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useContext } from 'react';

export const CommentSection = () => {
  const { attached, orphans, isLoading } = useThreads();
  const { editingComment } = useContext(SmartEditorContext);

  if (isLoading) {
    return null;
  }

  if (editingComment === null && attached.length === 0 && orphans.length === 0) {
    return null;
  }

  return (
    <div className="w-fit pr-4">
      <ThreadList />
    </div>
  );
};
