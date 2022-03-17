import styled, { css } from 'styled-components';

const listStyle = css`
  margin-bottom: 0;
  margin-top: 16px;
  padding-left: 16px;

  > ul,
  > ol {
    margin-top: 0;
  }
`;

export const BulletListStyle = styled.ul`
  ${listStyle}
`;

export const NumberedListStyle = styled.ol`
  ${listStyle}
`;
