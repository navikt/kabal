import React from 'react';
import styled from 'styled-components';
import { isoDateTimeToPretty } from '../../../domain/date';
import { ISmartEditorComment } from '../../../redux-api/smart-editor-types';

export const Comment = ({ author, created, text }: ISmartEditorComment) => (
  <StyledCommentContainer>
    <StyledComment>
      <StyledName>{author.name}</StyledName>
      <StyledDate dateTime={created}>{isoDateTimeToPretty(created)}</StyledDate>
      <StyledText>{text}</StyledText>
    </StyledComment>
  </StyledCommentContainer>
);

const StyledComment = styled.article`
  text-align: left;
`;

const StyledName = styled.p`
  font-family: Source Sans Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
  margin: 0;
`;

const StyledDate = styled.time`
  font-family: Source Sans Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
  margin-top: 1em;
  margin-bottom: 2em;
`;

const StyledText = styled.p`
  font-family: Source Sans Pro;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: left;
  margin: 0;
  white-space: normal;
`;

const StyledCommentContainer = styled.li`
  margin-bottom: 1em;
  font-size: 16px;
  line-height: 22px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;
