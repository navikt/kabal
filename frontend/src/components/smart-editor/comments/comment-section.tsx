import React from 'react';
import styled from 'styled-components';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';

export const CommentSection = () => (
  <StyledCommentSection>
    <NewCommentThread />
    <StyledThreadList>
      <ThreadList />
    </StyledThreadList>
  </StyledCommentSection>
);

export const StyledThreadList = styled.section`
  flex-shrink: 0;
  width: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

const StyledCommentSection = styled.div`
  height: 100%;
  position: relative;
`;
