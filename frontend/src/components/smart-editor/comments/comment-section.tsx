import { skipToken } from '@reduxjs/toolkit/query/react';
import React, { useContext } from 'react';
import { Range, Selection } from 'slate';
import styled from 'styled-components';
import { useOppgaveId } from '../../../hooks/oppgavebehandling/use-oppgave-id';
import { useGetSmartEditorQuery } from '../../../redux-api/smart-editor-api';
import { useGetCommentsQuery } from '../../../redux-api/smart-editor-comments';
import { ISmartEditorComment } from '../../../types/smart-editor-comments';
import { SmartEditorContext } from '../context/smart-editor-context';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';

export const CommentSection = React.memo(
  () => {
    const oppgaveId = useOppgaveId();
    const { documentId, selection, focusedThreadIds } = useContext(SmartEditorContext);
    const { data: smartEditor } = useGetSmartEditorQuery(
      documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
    );

    const { data: threads } = useGetCommentsQuery(
      documentId === null ? skipToken : { oppgaveId, dokumentId: documentId }
    );

    const show = showNewCommentThread(selection) || showThreadList(focusedThreadIds, threads);

    if (smartEditor === null || !show) {
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
  flex-shrink: 0;
  width: 350px;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const showNewCommentThread = (selection: Selection) => selection !== null && Range.isExpanded(selection);

const showThreadList = (focusedThreadIds: string[], threads?: ISmartEditorComment[]) =>
  focusedThreadIds.length > 0 || (typeof threads !== 'undefined' && threads.length > 0);
