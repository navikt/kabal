import React from 'react';
import { RenderLeafProps } from 'slate-react';
import { StyledLeaf } from './styled';

export const renderLeaf = (props: RenderLeafProps, focusedThreadIds: string[]) => (
  <Leaf {...props} focusedThreadIds={focusedThreadIds} />
);

interface LeafProps extends RenderLeafProps {
  focusedThreadIds: string[];
}

const Leaf = (props: LeafProps) => {
  const { bold, italic, underline, strikethrough, subscript, superscript, selected, ...rest } = props.leaf;
  const { focusedThreadIds } = props;

  const commentThreadIds = Object.keys(rest).filter((n) => n.startsWith('commentThreadId_'));
  const focused = getFocused(commentThreadIds, focusedThreadIds);

  return (
    <StyledLeaf
      {...props.attributes}
      bold={bold}
      italic={italic}
      underline={underline}
      strikethrough={strikethrough}
      subscript={subscript}
      superscript={superscript}
      commentIds={commentThreadIds}
      selected={selected}
      focused={focused}
    >
      {props.children}
    </StyledLeaf>
  );
};

const getFocused = (commentThreadIds: string[], focusedThreadIds: string[]): boolean => {
  if (commentThreadIds.length === 0) {
    return false;
  }

  if (focusedThreadIds.length === 0) {
    return false;
  }

  return focusedThreadIds.some((id) => commentThreadIds.some((markId) => markId.endsWith(id)));
};
