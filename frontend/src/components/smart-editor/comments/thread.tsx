import { findNode, toDOMNode } from '@udecode/plate-common';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { styled } from 'styled-components';
import { SmartEditorContext } from '@app/components/smart-editor/context';
import { useMyPlateEditorRef } from '@app/plate/types';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { COMMENT_PREFIX } from '../constants';
import { CommentList } from './comment-list';
import { NewCommentInThread } from './new-comment-in-thread';

interface Props {
  thread: ISmartEditorComment;
  isFocused: boolean;
  isOrphan?: boolean;
}

const DONT_WAIT_FOR_TRANSITION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Thread = ({ thread, isFocused, isOrphan = false }: Props) => {
  const { setFocusedThreadId, focusedThreadId } = useContext(SmartEditorContext);
  const editor = useMyPlateEditorRef();

  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (focusedThreadId === thread.id) {
      setFocusedThreadId(null);
    }
  }, [focusedThreadId, setFocusedThreadId, thread.id]);

  const open: React.MouseEventHandler<HTMLElement> = useCallback(
    (event) => {
      if (focusedThreadId === thread.id) {
        return;
      }

      setFocusedThreadId(thread.id);

      if (isOrphan) {
        return;
      }

      const leafEntry = findNode(editor, { at: [], match: { [`${COMMENT_PREFIX}${thread.id}`]: true } });

      if (leafEntry === undefined) {
        return;
      }

      const [leafNode] = leafEntry;
      const domNode = toDOMNode(editor, leafNode);

      if (domNode === undefined) {
        return;
      }

      if (DONT_WAIT_FOR_TRANSITION) {
        return domNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      event.currentTarget.addEventListener(
        'transitionend',
        () => setTimeout(() => domNode.scrollIntoView({ behavior: 'smooth', block: 'center' })),
        { once: true },
      );
    },
    [editor, focusedThreadId, isOrphan, setFocusedThreadId, thread.id],
  );

  const onFocus = useCallback(() => {
    setFocusedThreadId(thread.id);
  }, [setFocusedThreadId, thread.id]);

  useEffect(() => {
    if (isFocused && ref.current !== null) {
      requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' }));
    }
  }, [isFocused, ref]);

  const comments: ISmartEditorComment[] = isFocused
    ? [thread, ...thread.comments]
    : [{ ...thread, text: thread.text.length >= 90 ? `${thread.text.substring(0, 85)}\u2026` : thread.text }];

  return (
    <StyledThread ref={ref} $isFocused={isFocused} onClick={open}>
      <CommentList comments={comments} isFocused={isFocused} />
      {isFocused ? null : <Replies>{thread.comments.length} svar</Replies>}
      <NewCommentInThread threadId={thread.id} close={close} isFocused={isFocused} onFocus={onFocus} />
    </StyledThread>
  );
};

const StyledThread = styled.section<{ $isFocused: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: white;
  padding: 16px;
  border: 1px solid #c9c9c9;
  border-radius: var(--a-border-radius-medium);
  will-change: transform, opacity, box-shadow;
  cursor: ${({ $isFocused: isFocused }) => (isFocused ? 'auto' : 'pointer')};
  user-select: ${({ $isFocused: isFocused }) => (isFocused ? 'auto' : 'none')};
  opacity: ${({ $isFocused: isFocused }) => (isFocused ? '1' : '0.5')};
  box-shadow: ${({ $isFocused: isFocused }) => (isFocused ? '0 1px 4px 0 rgba(0, 0, 0, 0.3)' : 'none')};
  transform: ${({ $isFocused: isFocused }) => (isFocused ? 'translateX(-10px)' : 'translateX(0px)')};
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;
  transition-property: transform, opacity, box-shadow;
  scroll-snap-align: start;

  &:hover {
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }
`;

const Replies = styled.div`
  font-style: italic;
  color: var(--a-gray-700);
  text-align: right;
`;
