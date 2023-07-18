import { CheckmarkIcon } from '@navikt/aksel-icons';
import React from 'react';
import { styled } from 'styled-components';
import { Flettefelt } from '../../types/editor-void-types';
import { getFlettefeltName } from './functions';
import { useFlettefeltValue } from './use-flettefelt-value';

interface Props {
  field: Flettefelt;
  isActive: boolean;
  isFocused: boolean;
  onClick: () => void;
}

export const DropdownButton = ({ field, isFocused, isActive, onClick }: Props) => {
  const value = useFlettefeltValue(field);
  const name = getFlettefeltName(field);

  return (
    <StyledDropdownButton onClick={onClick} $isFocused={isFocused}>
      {getButtonContent(isActive, name, value)}
    </StyledDropdownButton>
  );
};

const getButtonContent = (isActive: boolean, name: string | undefined, value: string | null) => {
  const text = value === null ? name : `${name ?? ''} (${value})`;

  if (!isActive) {
    return <>{text}</>;
  }

  return (
    <>
      <StyledSelectedIcon />
      {text}
    </>
  );
};

const StyledDropdownButton = styled.button<{ $isFocused: boolean }>`
  border: none;
  width: 100%;
  background-color: ${({ $isFocused }) => ($isFocused ? '#cce1ff' : 'transparent')};
  padding: 4px;
  border-radius: 4px;
  white-space: nowrap;
  text-align: left;
  position: relative;
  padding-left: 24px;
  cursor: pointer;

  &:hover {
    background-color: #cce1ff;
  }
`;

const StyledSelectedIcon = styled(CheckmarkIcon)`
  position: absolute;
  top: 4px;
  left: 4px;
  width: 16px;
`;
