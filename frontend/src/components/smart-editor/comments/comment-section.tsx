import { skipToken } from '@reduxjs/toolkit/query/react';
import React from 'react';
import styled from 'styled-components';
import { useKlagebehandlingId } from '../../../hooks/use-klagebehandling-id';
import { useGetSmartEditorQuery } from '../../../redux-api/smart-editor';
import { useGetSmartEditorIdQuery } from '../../../redux-api/smart-editor-id';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';

export const CommentSection = React.memo(
  () => {
    const klagebehandlingId = useKlagebehandlingId();
    const { data: smartEditorIdData } = useGetSmartEditorIdQuery(klagebehandlingId);
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
  padding-right: 1em;
  overflow-y: auto;
  overflow-x: hidden;
`;
