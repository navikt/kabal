import React from 'react';
import { styled } from 'styled-components';
import { ThreadList } from './thread-list';

export const CommentSection = () => (
  <StyledCommentSection>
    <ThreadList />
  </StyledCommentSection>
);

const StyledCommentSection = styled.div`
  height: 100%;
  width: 350px;
  position: sticky;
  top: 0;
  background-color: var(--a-bg-subtle);
  overflow-y: auto;
`;
