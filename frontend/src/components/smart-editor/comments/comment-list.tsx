import React from 'react';
import { styled } from 'styled-components';
import { ISmartEditorComment } from '@app/types/smart-editor/comments';
import { Comment } from './comment';

interface CommentListProps {
  comments: ISmartEditorComment[];
  isExpanded: boolean;
}

export const CommentList = ({ comments, isExpanded }: CommentListProps) => (
  <List>
    {comments.map(({ id, ...comment }, index) => (
      <Comment key={id} id={id} isExpanded={isExpanded} {...comment} isMain={index === 0} />
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
  font-size: 16px;
`;
