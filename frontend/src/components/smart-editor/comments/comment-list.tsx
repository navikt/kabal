import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { VStack } from '@navikt/ds-react';
import { Comment } from './comment';

interface CommentListProps {
  comments: ISmartEditorComment[];
}

export const CommentList = ({ comments }: CommentListProps) => (
  <VStack as="ul" gap="4" padding="0" margin="0">
    {comments.map((comment, index) => (
      <Comment key={comment.id} comment={comment} isMain={index === 0} />
    ))}
  </VStack>
);
