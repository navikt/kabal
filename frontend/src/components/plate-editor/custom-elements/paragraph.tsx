import styled from 'styled-components';
import { ParagraphElement } from '../types';
import { getTextAlign } from './helpers';

export const Paragraph = styled.p<ParagraphElement>`
  font-size: 12pt;
  white-space: pre-wrap;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: ${({ indent = 0 }) => indent * 24}pt;
  text-align: ${({ textAlign }) => getTextAlign(textAlign)};
`;
