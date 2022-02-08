import { skipToken } from '@reduxjs/toolkit/query/react';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery } from '../../../redux-api/smart-editor-api';
import { SmartEditorContext } from '../context/smart-editor-context';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';

export const CommentSection = React.memo(
  () => {
    const oppgaveId = useOppgaveId();
    const { documentId } = useContext(SmartEditorContext);
    const { data: smartEditor } = useGetSmartEditorQuery(
      documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
    );

    if (smartEditor === null) {
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
  width: 30%;
  height: 100%;
  padding-left: 2em;
  overflow-y: auto;
  overflow-x: hidden;
`;
