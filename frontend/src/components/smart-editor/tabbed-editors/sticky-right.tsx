import React, { useContext, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { Bookmarks, getBookmarks } from '@app/components/smart-editor/bookmarks/bookmarks';
import { CommentSection } from '@app/components/smart-editor/comments/comment-section';
import { useThreads } from '@app/components/smart-editor/comments/use-threads';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useMyPlateEditorState } from '@app/plate/types';

interface StickyRightProps {
  id: string;
}

export const StickyRight = ({ id }: StickyRightProps) => {
  const { newCommentSelection, bookmarksMap, setInitialBookmarks } = useContext(SmartEditorContext);
  const { attached, orphans } = useThreads();
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

  if (
    attached.length === 0 &&
    orphans.length === 0 &&
    newCommentSelection === null &&
    Object.keys(bookmarksMap).length === 0
  ) {
    return null;
  }

  return (
    <StickyRightContainer>
      <Bookmarks editorId={id} />
      <CommentSection />
    </StickyRightContainer>
  );
};

const StickyRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  position: sticky;
  top: 0;
  overflow-y: auto;
  height: 100%;
  margin-left: -370px;
  margin-right: 20px;
`;
