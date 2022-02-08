import { css } from 'styled-components';

export const documentsGridCSS = css`
  & {
    display: grid;
    grid-template-columns: auto 155px 55px 32px;
    grid-template-areas: 'title meta date action';
    grid-column-gap: 16px;
    align-items: center;
    padding: 4px;
  }
`;
