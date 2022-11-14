import React from 'react';
import styled from 'styled-components';

interface Props {
  isChecked: boolean;
  onCheck: (checked: boolean) => void;
  children: string;
  onFocus: () => void;
  isFocused: boolean;
  isCurrentColumn: boolean;
  isCurrentRow: boolean;
}

export const Cell = ({ isChecked, onCheck, children, onFocus, isFocused, isCurrentColumn, isCurrentRow }: Props) => (
  <StyledCell
    title={children}
    $isChecked={isChecked}
    onClick={onFocus}
    onMouseEnter={onFocus}
    $isFocused={isFocused}
    $isCurrentColumn={isCurrentColumn}
    $isCurrentRow={isCurrentRow}
  >
    <StyledCheckbox
      type="checkbox"
      title={children}
      checked={isChecked}
      onChange={({ target }) => onCheck(target.checked)}
    />
  </StyledCell>
);

interface StyledCellProps {
  $isChecked: boolean;
  $isFocused: boolean;
  $isCurrentColumn: boolean;
  $isCurrentRow: boolean;
}

const getColor = (
  { $isChecked, $isFocused, $isCurrentColumn, $isCurrentRow }: StyledCellProps,
  defaultColor = 'white'
) => {
  if ($isFocused || $isCurrentColumn || $isCurrentRow) {
    if ($isChecked) {
      return 'var(--navds-global-color-purple-200)';
    }

    return 'var(--navds-global-color-blue-200)';
  }

  if ($isChecked) {
    return 'var(--navds-global-color-green-200)';
  }

  return defaultColor;
};

const StyledCell = styled.td<StyledCellProps>`
  padding: 0;
  border-right: 1px solid var(--navds-semantic-color-border-inverted);
  border-bottom: 1px solid var(--navds-semantic-color-border-inverted);

  :nth-child(even) {
    background-color: ${getColor};
  }

  :nth-child(odd) {
    background-color: ${(props) => getColor(props, 'rgb(247, 247, 247)')};
  }
`;

const StyledCheckbox = styled.input`
  display: block;
  width: 32px;
  height: 32px;
  border: none;
  margin: 0;
  padding: 0;
  opacity: 0;
  cursor: pointer;
`;
