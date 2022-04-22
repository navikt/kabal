import React, { useContext, useRef } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../../hooks/use-on-click-outside';
import { SmartEditorContext } from '../context/smart-editor-context';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';

export const CommentSection = () => (
  <CommentsClickBoundry>
    <NewCommentThread />
    <StyledThreadList>
      <ThreadList />
    </StyledThreadList>
  </CommentsClickBoundry>
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

interface CommentsClickBoundryProps {
  children: React.ReactNode;
}

const CommentsClickBoundry = ({ children }: CommentsClickBoundryProps) => {
  const { setFocusedThreadId } = useContext(SmartEditorContext);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => {
    setFocusedThreadId(null);
  }, ref);

  return <StyledCommentSection ref={ref}>{children}</StyledCommentSection>;
};
