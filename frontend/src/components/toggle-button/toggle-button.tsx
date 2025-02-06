import { styled } from 'styled-components';

interface Props {
  $open: boolean;
  $minHeight?: string;
  $error?: boolean;
}

export const ToggleButton = styled.button<Props>`
  border: 1px solid ${({ $error }) => ($error === true ? 'var(--a-border-danger)' : 'var(--a-border-default)')};
  box-shadow: ${({ $error }) => ($error === true ? '0 0 0 1px var(--a-border-danger)' : 'none')};
  min-height: ${({ $minHeight }) => (typeof $minHeight === 'undefined' ? '2rem' : $minHeight)};
  white-space: nowrap;
  border-radius: 0.25rem;
  transition: box-shadow 0.1s ease;
  cursor: pointer;
  user-select: none;
  position: relative;
  font-size: var(--a-font-size-small);
  font-weight: 600;
  color: var(--a-text-default);
  padding-left: var(--a-spacing-2);
  padding-right: var(--a-spacing-2);

  display: flex;
  align-items: center;

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--a-border-action-selected);
  }

  &:disabled {
    cursor: not-allowed;
    border-color: var(--a-border-subtle);
    background-color: var(--a-bg-default);
    opacity: 0.7;
  }
`;
