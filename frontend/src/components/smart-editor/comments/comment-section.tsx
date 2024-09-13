import { useThreads } from '@app/components/smart-editor/comments/use-threads';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useContext } from 'react';
import { styled } from 'styled-components';
import { ThreadList } from './thread-list';

export const CommentSection = () => {
  const { attached, orphans, isLoading } = useThreads();
  const { newCommentSelection } = useContext(SmartEditorContext);

  if (isLoading) {
    return null;
  }

  if (newCommentSelection === null && attached.length === 0 && orphans.length === 0) {
    return null;
  }

  return (
    <StyledCommentSection>
      <ThreadList />
    </StyledCommentSection>
  );
};

const StyledCommentSection = styled.div`
  width: fit-content;
  padding-right: var(--a-spacing-4);
`;
