import React from 'react';
import styled from 'styled-components';
import { isoDateTimeToPretty } from '../../../domain/date';
import { ISmartEditorComment } from '../../../types/smart-editor-comments';

export const Comment = ({ author, created, text }: ISmartEditorComment) => (
  <StyledListItem>
    <StyledComment>
      <StyledName>{author.name}</StyledName>
      <StyledDate dateTime={created}>{isoDateTimeToPretty(created)}</StyledDate>
      <StyledText>{text}</StyledText>
    </StyledComment>
  </StyledListItem>
);

const StyledListItem = styled.li`
  padding-left: 4px;
  border-left: 4px solid lightgrey;

  &:first-child {
    padding-left: 0;
    border-left: none;
  }
`;

const StyledComment = styled.article`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StyledName = styled.p`
  font-weight: bold;
  margin: 0;
`;

const StyledDate = styled.time`
  display: block;
  width: 100%;
`;

const StyledText = styled.p`
  margin: 0;
  white-space: normal;
  word-wrap: break-word;
`;
