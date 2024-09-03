import { styled } from 'styled-components';

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
    color: var(--a-text-subtle);
  }
`;

export const Wrapper = styled.span`
  display: inline-block;
  border-radius: var(--a-border-radius-medium);
  outline: none;
  color: var(--a-text-default);
  position: relative;

  &::after {
    cursor: text;
    color: var(--a-text-subtle);
    content: attr(data-placeholder);
    user-select: none;
  }
`;
