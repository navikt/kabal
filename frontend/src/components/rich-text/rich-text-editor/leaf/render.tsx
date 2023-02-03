import React, { useLayoutEffect, useRef } from 'react';
import { RenderLeafProps } from 'slate-react';
import { COMMENT_PREFIX } from '../../../smart-editor/constants';
import { StyledLeaf } from './styled';

export const renderLeaf = (props: RenderLeafProps, focusedThreadId: string | null = null, isExpanded: boolean) => (
  <Leaf {...props} focusedThreadId={focusedThreadId} isExpanded={isExpanded} />
);

interface LeafProps extends RenderLeafProps {
  focusedThreadId: string | null;
  isExpanded: boolean;
}

const Leaf = ({ attributes, leaf, children, focusedThreadId, isExpanded }: LeafProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { bold, italic, underline, strikethrough, subscript, superscript, selected, placeholder, ...rest } = leaf;

  const commentThreadIds = Object.keys(rest).filter((n) => n.startsWith(COMMENT_PREFIX));
  const isFocused = getFocused(commentThreadIds, focusedThreadId);

  useLayoutEffect(() => {
    if (isFocused && ref.current !== null) {
      requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' }));
    }
  }, [isFocused]);

  return (
    <StyledLeaf
      {...attributes}
      bold={bold}
      italic={italic}
      underline={underline}
      strikethrough={strikethrough}
      subscript={subscript}
      superscript={superscript}
      placeholder={typeof placeholder === 'string' ? placeholder : undefined}
      commentIds={commentThreadIds}
      selected={selected}
      focused={isFocused}
      isExpanded={isExpanded}
      hasText={leaf.text.length !== 0}
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
