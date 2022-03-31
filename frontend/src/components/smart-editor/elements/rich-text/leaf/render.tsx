import React, { useEffect, useRef } from 'react';
import { RenderLeafProps } from 'slate-react';
import { COMMENT_PREFIX } from '../../../constants';
import { StyledLeaf } from './styled';

export const renderLeaf = (props: RenderLeafProps, focusedThreadId: string | null = null) => (
  <Leaf {...props} focusedThreadId={focusedThreadId} />
);

interface LeafProps extends RenderLeafProps {
  focusedThreadId: string | null;
}

const Leaf = ({ attributes, leaf, children, focusedThreadId }: LeafProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { bold, italic, underline, strikethrough, subscript, superscript, selected, ...rest } = leaf;

  const commentThreadIds = Object.keys(rest).filter((n) => n.startsWith(COMMENT_PREFIX));
  const focused = getFocused(commentThreadIds, focusedThreadId);

  useEffect(() => {
    if (focused && ref.current !== null) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focused]);

  return (
    <StyledLeaf
      {...attributes}
      bold={bold}
      italic={italic}
      underline={underline}
      strikethrough={strikethrough}
      subscript={subscript}
      superscript={superscript}
      commentIds={commentThreadIds}
      selected={selected}
      focused={focused}
      ref={ref}
    >
      {children}
    </StyledLeaf>
  );
};

const getFocused = (commentThreadIds: string[], focusedThreadId: string | null): boolean => {
  if (focusedThreadId === null || commentThreadIds.length === 0) {
    return false;
  }

  const threadIdMark = `${COMMENT_PREFIX}${focusedThreadId}`;

  return commentThreadIds.includes(threadIdMark);
};
