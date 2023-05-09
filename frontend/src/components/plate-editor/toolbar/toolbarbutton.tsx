import React from 'react';
import styled from 'styled-components';

interface ToolbarIconButtonProps extends ToolbarButtonProps {
  icon: React.ReactNode;
}

interface ToolbarButtonProps extends ToolbarButtonStyleProps {
  label: string;
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
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
      onClick(event);
    }}
  >
    {icon}
  </ToolbarButtonStyle>
);

const ToolbarButtonStyle = styled.button<ToolbarButtonStyleProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 4px;
  padding-right: 4px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? 'var(--a-blue-100)' : 'transparent')};
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  font-family: Source Sans Pro;
  color: black;
  font-size: 16px;
  font-weight: ${({ fontWeight }) => fontWeight ?? 'normal'};
  width: 32px;
  height: 32px;

  :hover {
    opacity: 1;
    background-color: #c9c9c9;
  }

  :disabled {
    cursor: not-allowed;
    opacity: 0.25;
  }
`;
