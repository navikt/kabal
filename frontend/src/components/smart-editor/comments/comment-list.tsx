import React from 'react';
import styled from 'styled-components';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { Comment } from './comment';

interface CommentListProps {
  comments: ISmartEditorComment[];
  isFocused: boolean;
}

export const CommentList = ({ comments, isFocused }: CommentListProps) => (
  <List>
    {comments.map(({ id, ...comment }) => (
      <Comment key={id} id={id} isFocused={isFocused} {...comment} />
    ))}
  </List>
);

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0;
  margin: 0;
  list-style: none;
`;
