import styled from 'styled-components';

interface ToggleButtonTheme {
  open: boolean;
  minHeight: string | undefined;
}

export const ToggleButton = styled.button`
  border: 1px solid #78706a;
  padding: 0 1.75rem 0 0.5rem;
  min-height: ${({ theme }: { theme: ToggleButtonTheme }) =>
    typeof theme.minHeight === 'undefined' ? '2rem' : theme.minHeight};
  width: 100%;
  white-space: nowrap;
  border-radius: 0.25rem;
  transition: box-shadow 0.1s ease;
  cursor: pointer;
  background: none;
  user-select: none;
  position: relative;
  font-size: 14px;
  font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
  font-weight: 600;
  color: #3e3832;

  ::before,
  ::after {
    content: '';
    position: absolute;
    width: 0.5rem;
    border-radius: 2px;
    height: 2px;
    background: #59514b;
    right: 0.5rem;
    top: 50%;
    transition: transform 0.1s ease;
  }

  ::before {
    transform: ${({ theme }: { theme: ToggleButtonTheme }) =>
      theme.open
        ? 'translateX(-3px) translateY(-50%) rotate(-45deg)'
        : 'translateX(-3px) translateY(-50%) rotate(45deg)'};
  }

  ::after {
    transform: ${({ theme }: { theme: ToggleButtonTheme }) =>
      theme.open
        ? 'translateX(1.5px) translateY(-50%) rotate(45deg)'
        : 'translateX(1.5px) translateY(-50%) rotate(-45deg)'};
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #254b6d;
  }

  &:disabled {
    border-color: #6a6a6a;
    background: #f1f1f1;
    opacity: 0.7;
  }
`;
