import React from 'react';
import styled from 'styled-components';

interface ToolbarIconButtonProps extends ToolbarButtonProps {
  icon: React.ReactChild;
}
interface ToolbarTextButtonProps extends ToolbarButtonProps {
  text: React.ReactChild;
  fontWeight?: number;
}

interface ToolbarButtonProps extends ToolbarButtonStyleProps {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

interface ToolbarButtonStyleProps {
  active: boolean;
  fontWeight?: number;
}

export const ToolbarIconButton = ({ label, icon, onClick, active, disabled = false }: ToolbarIconButtonProps) => (
  <ToolbarButtonStyle
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    active={active}
    onMouseDown={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    {icon}
  </ToolbarButtonStyle>
);

export const ToolbarTextButton = ({
  label,
  text,
  fontWeight = 400,
  onClick,
  active,
  disabled = false,
}: ToolbarTextButtonProps) => (
  <ToolbarButtonStyle
    title={label}
    aria-label={label}
    aria-pressed={active}
    disabled={disabled}
    active={active}
    fontWeight={fontWeight}
    onMouseDown={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    {text}
  </ToolbarButtonStyle>
);

const ToolbarButtonStyle = styled.button<ToolbarButtonStyleProps>`
  padding: 0.25em;
  margin-right: 0.5em;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#CCE1FF' : 'transparent')};
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  font-family: Source Sans Pro;
  color: black;
  font-size: 18px;
  font-weight: ${({ fontWeight }) => fontWeight ?? 'normal'};
  min-width: 2em;
  min-height: 2em;

  :hover {
    opacity: 1;
    background-color: #c9c9c9;
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }
`;
