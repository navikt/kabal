import { Comment } from '@app/components/smart-editor/comments/comment';
import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { VStack } from '@navikt/ds-react';

interface CommentListProps {
  comments: ISmartEditorComment[];
}

export const CommentList = ({ comments }: CommentListProps) => (
  <VStack as="ul" gap="space-16" padding="space-0" margin="space-0">
    {comments.map((comment, index) => (
      <Comment key={comment.id} comment={comment} isMain={index === 0} />
    ))}
  </VStack>
);
