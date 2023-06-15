import { css } from 'styled-components';

export const documentCSS = css`
  position: relative;
  width: 100%;
  padding-right: 0;
  border-radius: 4px;
  background-color: transparent;
  transition: background-color 0.2s ease-in-out;
  min-height: 34.5px;
`;

export const getBackgroundColor = (expanded: boolean, selected: boolean) => {
  if (expanded) {
    return 'var(--a-surface-subtle)';
  }

  if (selected) {
    return 'var(--a-surface-selected)';
  }

  return 'transparent';
};

export const getHoverBackgroundColor = (expanded: boolean, selected: boolean) => {
  if (expanded) {
    return 'var(--a-surface-subtle)';
  }

  if (selected) {
    return 'var(--a-surface-action-subtle-hover)';
  }

  return 'var(--a-surface-hover)';
};
