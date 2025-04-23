import { css } from 'styled-components';

export const documentCSS = css`
  position: relative;
  width: 100%;
  height: var(--a-spacing-8);
  border-radius: var(--a-border-radius-medium);
  transition: background-color 100ms ease-in-out;
`;

export const DOCUMENT_CLASSES = 'relative w-full h-8 pr-0 rounded-medium transition-colors duration-100 ease-in-out';
