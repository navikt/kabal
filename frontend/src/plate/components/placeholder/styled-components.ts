import { styled } from 'styled-components';

interface WrapperStyleProps {
  $placeholder: string;
  $focused: boolean;
  $hasText: boolean;
  $hasButton: boolean;
}

export const Wrapper = styled.span<WrapperStyleProps>`
  display: inline-block;
  background-color: ${({ $focused }) => getBackgroundColor($focused)};
  border-radius: var(--a-border-radius-medium);
  outline: none;
  color: #000;
  padding-left: ${({ $hasButton }) => ($hasButton ? '1em' : '0')};
  position: relative;

  &::after {
    cursor: text;
    color: var(--a-text-subtle);
    content: ${({ $hasText, $placeholder }) => ($hasText ? '""' : `"${$placeholder}"`)};
    user-select: none;
  }
`;

export const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin: 0;
  padding: 0;
  border-radius: var(--a-border-radius-medium);
  height: 1.333em;
  width: 1em;
  color: var(--a-text-danger);
  display: inline-flex;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;

  &:hover {
    &:disabled {
      background: none;
    }

    background-color: var(--a-surface-neutral-subtle-hover);
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

const getBackgroundColor = (focused: boolean) => (focused ? 'var(--a-blue-100)' : 'var(--a-gray-200)');
