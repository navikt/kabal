import styled, { css } from 'styled-components';
import { TextAlignEnum } from '../editor-types';
import { getTextAlign } from './getTextAlign';
import { AlignableStyleProps } from './types';

export const ParagraphStyle = styled.p<AlignableStyleProps>`
  font-size: 16px;
  text-align: ${({ textAlign }) => getTextAlign(textAlign)};
  white-space: pre-wrap;
`;

export const BlockQuoteStyle = styled.blockquote<AlignableStyleProps>`
  ${({ textAlign }) => getStyles(textAlign)};
  margin-left: 0;
  margin-right: 0;
  color: #666;
  text-align: ${({ textAlign }) => getTextAlign(textAlign)};
  white-space: pre-wrap;
`;

const getStyles = (textAlign: TextAlignEnum) => {
  if (textAlign === TextAlignEnum.TEXT_ALIGN_RIGHT) {
    return css`
      & {
        border-right: 2px solid #ddd;
        padding-right: 0.5em;
      }
    `;
  }

  return css`
    & {
      border-left: 2px solid #ddd;
      padding-left: 0.5em;
    }
  `;
};
