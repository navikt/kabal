// import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
// import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
// import { useGetAllCommentsQuery } from '../../../redux-api/smart-editor';
// import { useGetSmartEditorIdQuery } from '../../../redux-api/smart-editor-id';
import { ISmartEditorComment } from '../../../redux-api/smart-editor-types';
import { CommentList } from './comment-list';
import { NewCommentInThread } from './new-comment-in-thread';

interface ThreadProps {
  threadId: string;
  threads: ISmartEditorComment[] | undefined;
}

export const Thread = ({ threadId, threads }: ThreadProps) => {
  // const klagebehandlingId = useKlagebehandlingId();
  // const { data: smartEditorData } = useGetSmartEditorIdQuery(klagebehandlingId);
  // const { data: threads, isLoading } = useGetAllCommentsQuery(smartEditorData?.smartEditorId ?? skipToken);
  const [showAddComment, setShowAddComment] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  if (typeof threads === 'undefined') {
    return <NavFrontendSpinner />;
  }

  const thread = threads.find(({ id }) => id === threadId);

  if (typeof thread === 'undefined') {
    return null;
  }

  return (
    <StyledClickableList
      onMouseEnter={() => setShowAddComment(true)}
      onMouseLeave={() => setShowAddComment(false)}
      ref={ref}
    >
      <CommentList comments={[thread, ...thread?.comments]} />
      {(showAddComment || inputFocused) && (
        <NewCommentInThread threadId={threadId} onFocusChange={setInputFocused} focused={inputFocused} />
      )}
    </StyledClickableList>
  );
};

const StyledClickableList = styled.section`
  display: block;
  background: transparent;
  padding: 24px;
  border: 1px solid #c9c9c9;
  border-radius: 4px;
  margin-bottom: 1em;
  width: 100%;

  &::last-of-type {
    margin-bottom: 0;
  }

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;
