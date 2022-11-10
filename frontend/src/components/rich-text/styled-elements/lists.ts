import styled, { css } from 'styled-components';
import { IndentableStyleProps } from './types';

const listStyle = css`
  & {
    margin-bottom: 0;
    margin-top: 0;
  }
`;

export const BulletListStyle = styled.ul<IndentableStyleProps>`
  ${listStyle}
  padding-left: ${({ indent = 0 }) => indent * 24 + 12}pt;
`;

export const NumberedListStyle = styled.ol<IndentableStyleProps>`
  ${listStyle}
  padding-left: ${({ indent = 0 }) => indent * 24 + 12}pt;
`;

export const ListItemStyle = styled.li``;
