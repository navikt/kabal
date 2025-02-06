import type { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { VStack } from '@navikt/ds-react';
import { Comment } from './comment';

interface CommentListProps {
  comments: ISmartEditorComment[];
  isExpanded: boolean;
}

export const CommentList = ({ comments, isExpanded }: CommentListProps) => (
  <VStack as="ul" gap="4" padding="0" margin="0" style={{ fontSize: 'var(--a-spacing-4)', listStyle: 'none' }}>
    {comments.map(({ id, ...comment }, index) => (
      <Comment key={id} id={id} isExpanded={isExpanded} {...comment} isMain={index === 0} />
    ))}
  </VStack>
);
