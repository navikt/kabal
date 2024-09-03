import { styled } from 'styled-components';

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 0;
  border-radius: var(--a-border-radius-medium);
  height: 100%;
  width: 1em;
  color: var(--a-text-danger);
  display: none;
  align-items: center;
  position: absolute;
  right: 100%;
  top: 0;
  bottom: 0;
  background-color: var(--a-gray-200);

  &:hover {
    &:not(:disabled) {
      background-color: var(--a-blue-100);
    }
  }

  &:active {
    background-color: var(--a-surface-neutral-active);
  }

  &:focus-visible {
    box-shadow:
      inset 0 0 0 2px var(--a-border-strong),
      var(--a-shadow-focus);
  }

  &:disabled {
    cursor: not-allowed;
    color: #444;
  }
`;

interface WrapperStyleProps {
  $placeholder: string;
  $focused: boolean;
  $hasText: boolean;
}

export const Wrapper = styled.span<WrapperStyleProps>`
  display: inline;
  background-color: ${({ $focused }) => getBackgroundColor($focused)};
  border-radius: var(--a-border-radius-medium);
  outline: none;
  color: #000;
  /* position: relative; */

  &::after {
    cursor: text;
    color: var(--a-text-subtle);
    content: ${({ $hasText, $placeholder }) => ($hasText ? '""' : `"${$placeholder}"`)};
    user-select: none;
  }

  &:hover {
    ${DeleteButton} {
      display: inline-flex;
    }
  }
`;

const getBackgroundColor = (focused: boolean) => (focused ? 'var(--a-blue-100)' : 'var(--a-gray-200)');
