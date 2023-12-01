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
  background: none;
  user-select: none;
  position: relative;
  font-size: 14px;
  font-weight: 600;
  color: var(--a-text-default);

  display: flex;
  align-items: center;

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--a-border-action-selected);
  }

  &:disabled {
    cursor: not-allowed;
    border-color: #6a6a6a;
    background: #f1f1f1;
    opacity: 0.7;
  }
`;
