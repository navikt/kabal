import React, { useContext, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { Bookmarks, getBookmarks } from '@app/components/smart-editor/bookmarks/bookmarks';
import { CommentSection } from '@app/components/smart-editor/comments/comment-section';
import { NumberOfComments } from '@app/components/smart-editor/comments/number-of-comments';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useMyPlateEditorState } from '@app/plate/types';

interface StickyRightProps {
  id: string;
}

export const StickyRight = ({ id }: StickyRightProps) => {
  const { setInitialBookmarks } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorState(id);
  const isInitalized = useRef(false);

  useEffect(() => {
    if (!isInitalized.current) {
      isInitalized.current = true;
      setInitialBookmarks(getBookmarks(editor));

      return;
    }

    // Update bookmarks.
    const timer = setTimeout(
      () => requestIdleCallback(() => setInitialBookmarks(getBookmarks(editor)), { timeout: 200 }),
      500,
    );

    return () => clearTimeout(timer);
  }, [editor, editor.children, setInitialBookmarks]);

  return (
    <StickyRightContainer>
      <NumberOfComments />
      <Bookmarks editorId={id} />
      <CommentSection />
    </StickyRightContainer>
  );
};

const StickyRightContainer = styled.div`
  grid-area: right;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: sticky;
  top: 0;
  overflow-y: auto;
`;
