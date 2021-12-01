import React from 'react';
import styled from 'styled-components';
import { IStaticTextElement } from '../../../redux-api/smart-editor-types';

type Props = Pick<IStaticTextElement, 'content'>;

export const StaticText = ({ content }: Props) => <StyledParagraphElement>{content.join('\n')}</StyledParagraphElement>;

const StyledParagraphElement = styled.p`
  font-size: 16px;
  margin: 0;
  margin-top: 1em;
  margin-bottom: 1em;
  padding-left: 2em;
  padding-right: 2em;
  white-space: pre;
`;
