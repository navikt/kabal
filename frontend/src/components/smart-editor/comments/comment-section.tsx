import React from 'react';
import styled from 'styled-components';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';

export const CommentSection = React.memo(
  () => (
    <CommentSectionContainer>
      <NewCommentThread />
      <ThreadList />
    </CommentSectionContainer>
  ),
  () => true
);

CommentSection.displayName = 'CommentSection';

export const CommentSectionContainer = styled.section`
  width: 355px;
  height: 100%;
  padding-right: 2em;
  padding-left: 2em;
  overflow-y: auto;
  overflow-x: hidden;
`;
