import { css } from 'styled-components';

export const documentCSS = css`
  position: relative;
  width: 100%;
  padding-right: 0;
  border-radius: var(--a-border-radius-medium);
  background-color: transparent;
  transition: background-color 100ms ease-in-out;
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
