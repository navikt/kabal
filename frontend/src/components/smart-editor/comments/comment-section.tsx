import { skipToken } from '@reduxjs/toolkit/query/react';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery } from '../../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../../redux-api/smart-editor-id';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';

export const CommentSection = React.memo(
  () => {
    const oppgaveId = useOppgaveId();
    const { data: smartEditorIdData } = useGetSmartEditorIdQuery(oppgaveId);
    const { data: smartEditor } = useGetSmartEditorQuery(smartEditorIdData?.smartEditorId ?? skipToken);

    if (typeof smartEditorIdData === 'undefined' || smartEditorIdData?.smartEditorId === null || smartEditor === null) {
      return null;
    }

    return (
      <CommentSectionContainer>
        <NewCommentThread />
        <ThreadList />
      </CommentSectionContainer>
    );
  },
  () => true
);

CommentSection.displayName = 'CommentSection';

export const CommentSectionContainer = styled.section`
  width: 355px;
  height: 100%;
  padding-left: 2em;
  overflow-y: auto;
  overflow-x: hidden;
`;
