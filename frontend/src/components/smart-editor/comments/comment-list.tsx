import { VStack } from '@navikt/ds-react';
import { Comment } from '@/components/smart-editor/comments/comment';
import type { ISmartEditorComment } from '@/types/smart-editor/comments';

interface CommentListProps {
  comments: ISmartEditorComment[];
  hasWriteAccess: boolean;
}

export const CommentList = ({ comments, hasWriteAccess }: CommentListProps) => (
  <VStack as="ul" gap="space-16" padding="space-0" margin="space-0">
    {comments.map((comment, index) => (
      <Comment key={comment.id} comment={comment} isMain={index === 0} hasWriteAccess={hasWriteAccess} />
    ))}
  </VStack>
);
