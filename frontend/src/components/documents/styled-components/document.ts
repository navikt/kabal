import { css } from 'styled-components';

export const documentCSS = css`
  position: relative;
  width: 100%;
  height: var(--a-spacing-8);
  padding-right: 0;
  border-radius: var(--a-border-radius-medium);
  background-color: transparent;
  transition: background-color 100ms ease-in-out;
`;

export const getBackgroundColor = (selected: boolean) => (selected ? 'var(--a-urface-selected)' : 'transparent');

export const getHoverBackgroundColor = (selected: boolean) =>
  selected ? 'var(--a-surface-action-subtle-hover)' : 'var(--a-surface-hover)';
