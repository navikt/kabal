import React, { useContext } from 'react';
import { Range } from 'slate';
import { ReactEditor, useSlate, useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { SmartEditorContext } from '../context/smart-editor-context';
import { NewCommentThread } from './new-thread';
import { ThreadList } from './thread-list';
import { useThreads } from './use-threads';

export const CommentSection = () => {
  const { attached, orphans } = useThreads();
  const { showNewComment, setShowNewComment } = useContext(SmartEditorContext);
  const { selection } = useSlate();
  const editor = useSlateStatic();

  const isValidSelection = Range.isRange(selection) && Range.isExpanded(selection);

  const showNewThread = showNewComment && isValidSelection;

  // If there are comments, either attached or orphans, show the comment list.
  const showCommentSection = showNewThread || attached.length !== 0 || orphans.length !== 0;

  if (!showCommentSection) {
    return null;
  }

  return (
    <StyledCommentSection>
      <NewCommentThread
        show={showNewThread}
        close={() => {
          setShowNewComment(false);

          if (editor !== null) {
            ReactEditor.focus(editor);
          }
        }}
      />
      <ThreadList />
    </StyledCommentSection>
  );
};

const StyledCommentSection = styled.div`
  height: 100%;
  width: 350px;
  position: relative;
`;
