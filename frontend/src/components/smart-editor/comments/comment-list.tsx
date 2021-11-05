import React from 'react';
import styled from 'styled-components';
import { ISmartEditorComment } from '../../../redux-api/smart-editor-types';
import { Comment } from './comment';

interface CommentListProps {
  comments: ISmartEditorComment[];
}

export const CommentList = ({ comments }: CommentListProps) => (
  <List>
    {comments.map(({ id, ...comment }) => (
      <Comment key={id} id={id} {...comment} />
    ))}
  </List>
);

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;
