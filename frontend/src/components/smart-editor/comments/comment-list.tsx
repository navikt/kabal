import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { VStack } from '@navikt/ds-react';
import { Comment } from './comment';

interface CommentListProps {
  comments: ISmartEditorComment[];
  isExpanded: boolean;
}

export const CommentList = ({ comments, isExpanded }: CommentListProps) => (
  <VStack as="ul" gap="4" padding="0" margin="0" className="list-none text-base">
    {comments.map((comment, index) => (
      <Comment key={comment.id} isExpanded={isExpanded} comment={comment} isMain={index === 0} />
    ))}
  </VStack>
);
