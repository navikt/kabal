import { forwardRef } from 'react';
import { styled } from 'styled-components';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { CommentList } from './comment-list';
import { NewCommentInThread } from './new-comment-in-thread';

interface Props {
  thread: ISmartEditorComment;
  isAbsolute?: boolean;
  isExpanded?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onClose?: () => void;
  style?: Pick<React.CSSProperties, 'top' | 'left' | 'bottom' | 'transform'>;
}

export const THREAD_WIDTH = 350;

export const Thread = forwardRef<HTMLElement, Props>(
  ({ thread, style, onClick, onClose, isAbsolute = false, isExpanded = false }, ref) => {
    const comments: ISmartEditorComment[] = isExpanded ? [thread, ...thread.comments] : [thread];

    return (
      <StyledThread ref={ref} $isAbsolute={isAbsolute} $isExpanded={isExpanded} onClick={onClick} style={style}>
        <CommentList comments={comments} isExpanded={isExpanded} />
        {isExpanded ? null : <Replies>{thread.comments.length} svar</Replies>}
        <NewCommentInThread threadId={thread.id} close={onClose} isExpanded={isExpanded} />
      </StyledThread>
    );
  },
);

Thread.displayName = 'Thread';

interface StyledProps {
  $isExpanded: boolean;
  $isAbsolute: boolean;
}

const StyledThread = styled.section<StyledProps>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: ${THREAD_WIDTH}px;
  position: ${({ $isAbsolute }) => ($isAbsolute ? 'absolute' : 'static')};
  background-color: var(--a-surface-default);
  padding: 16px;
  border: 1px solid #c9c9c9;
  border-radius: var(--a-border-radius-medium);
  will-change: transform, opacity, box-shadow;
  cursor: ${({ $isExpanded }) => ($isExpanded ? 'auto' : 'pointer')};
  user-select: ${({ $isExpanded }) => ($isExpanded ? 'auto' : 'none')};
  opacity: 1;
  box-shadow: ${({ $isExpanded }) => ($isExpanded ? 'var(--a-shadow-medium)' : 'none')};
  transition-duration: 0.1s;
  transition-timing-function: ease-in-out;
  transition-property: transform, opacity, box-shadow;
  scroll-snap-align: start;
  z-index: ${({ $isExpanded }) => ($isExpanded ? '3' : '1')};

  &:hover {
    box-shadow: var(--a-shadow-large);
    z-index: 2;
  }
`;

const Replies = styled.div`
  font-style: italic;
  color: var(--a-gray-700);
  text-align: right;
  font-size: 16px;
`;
