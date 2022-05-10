import { AddCircle } from '@navikt/ds-icons';
import React, { useContext, useEffect, useLayoutEffect } from 'react';
import { RenderElementProps, useSelected } from 'slate-react';
import styled from 'styled-components';
import { SmartEditorContext } from '../context/smart-editor-context';
import { CommentableVoidElementTypes } from '../editor-void-types';

interface CommentWrapperProps<T extends CommentableVoidElementTypes> extends RenderElementProps {
  content: JSX.Element;
  element: T;
}

export const CommentWrapper = <T extends CommentableVoidElementTypes>({
  content,
  element,
  children,
  attributes,
}: CommentWrapperProps<T>) => {
  const isSelected = useSelected();
  const { setFocusedThreadId, focusedThreadId, setActiveElement, activeElement, setShowNewComment } =
    useContext(SmartEditorContext);

  const isFocused = focusedThreadId !== null && element.threadIds.includes(focusedThreadId);

  useLayoutEffect(() => {
    if (isFocused && attributes.ref.current !== null) {
      requestAnimationFrame(() => attributes.ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' }));
    }
  }, [attributes.ref, isFocused]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (isSelected && (event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onAdd();
      }
    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);
  });

  const onAdd = () => {
    setActiveElement(element);
    setFocusedThreadId(null);
    setShowNewComment(true);
  };

  const onView = () => {
    setShowNewComment(false);
    setActiveElement(element);

    if (!isFocused && element.threadIds.length !== 0) {
      const [threadId] = element.threadIds;

      if (threadId !== undefined) {
        setFocusedThreadId(threadId);
      }
    }
  };

  const commentCount = element.threadIds.length;
  const isActive = activeElement === element;

  return (
    <div {...attributes}>
      {children}
      <StyledCommentWrapper
        isActive={isActive || isFocused}
        isSelected={isSelected}
        commentCount={commentCount}
        contentEditable={false}
      >
        <ShowContent commentCount={commentCount} onView={onView}>
          {content}
        </ShowContent>
        <StyledButtonWrapper>
          <StyledCommentButton onClick={onAdd} title="Legg til kommentar" alwaysVisible={false}>
            <AddCircle />
          </StyledCommentButton>
        </StyledButtonWrapper>
      </StyledCommentWrapper>
    </div>
  );
};

interface ShowContentProps {
  children: React.ReactNode;
  commentCount: number;
  onView: () => void;
}

const ShowContent = ({ children, commentCount, onView }: ShowContentProps): JSX.Element => {
  if (commentCount === 0) {
    return <StyledViewCommentsButton>{children}</StyledViewCommentsButton>;
  }

  const commentCountText = commentCount === 1 ? 'kommentar' : 'kommentarer';

  return (
    <StyledViewCommentsButton onFocus={onView} title={`Se ${commentCount} ${commentCountText}`} tabIndex={0}>
      {children}
    </StyledViewCommentsButton>
  );
};

const StyledViewCommentsButton = styled.div`
  display: block;
  width: 100%;
  border: none;
  background-color: transparent;
  text-align: left;
  padding: 0;
  margin: 0;
  cursor: text;
  user-select: text;

  &:focus {
    outline: none;
  }
`;

const StyledCommentButton = styled.button<{ alwaysVisible: boolean }>`
  position: sticky;
  top: 24px;
  background-color: transparent;
  height: fit-content;
  border: none;
  cursor: pointer;
  padding: 0;
  border-radius: 4px;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ alwaysVisible }) => (alwaysVisible ? 1 : 0)};
`;

const StyledButtonWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 0;
  height: 100%;
`;

const StyledCommentWrapper = styled.div<{ isActive: boolean; commentCount: number; isSelected: boolean }>`
  position: relative;
  margin-top: 4px;
  border-radius: 2px;
  transition: background-color 0.2s ease-in-out, outline-color 0.2s ease-in-out;
  background-color: ${({ commentCount, isActive, isSelected }) => getColor(commentCount, isActive, isSelected)};
  outline-color: ${({ commentCount, isActive, isSelected }) => getColor(commentCount, isActive, isSelected)};
  outline-style: solid;
  outline-width: 8px;

  :hover {
    > ${StyledButtonWrapper} > ${StyledCommentButton} {
      opacity: 1;
    }
  }
`;

const getColor = (comments: number, isActive: boolean, isSelected: boolean) => {
  if (!isActive && isSelected) {
    return '#f5f5f5';
  }

  if (comments === 0) {
    return isActive ? 'hsla(0, 75%, 85%, 1)' : 'transparent';
  }

  const lightness = 100 - 15 * Math.min(comments, 3);
  const hue = isActive ? 0 : 125;
  const saturation = isActive ? 75 : 50;
  return `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
};
