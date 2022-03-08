import { Close, SuccessStroke } from '@navikt/ds-icons';
import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  onChange: (checked: boolean) => void;
  checked: boolean;
  children: string;
  testId?: string;
}

export const Switch = ({ checked, onChange, children, testId }: SwitchProps): JSX.Element => (
  <StyledLabel>
    <StyledInput
      type="checkbox"
      checked={checked}
      onChange={({ target }) => onChange(target.checked)}
      data-testid={testId}
    />
    <SwitchUI checked={checked}>{children}</SwitchUI>
  </StyledLabel>
);

const StyledLabel = styled.label`
  display: flex;
  cursor: pointer;
  user-select: none;
  position: relative;
  align-items: center;
  padding: 6px 8px 6px 8px;
  border-radius: 8px;

  &:hover {
    background: #c9c9c9;
  }

  &:first-of-type {
    margin-left: -8px;
  }
`;

const StyledInput = styled.input`
  appearance: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: 8px;
  width: 48px;
  height: 100%;
`;

interface SwitchUiProps {
  checked: boolean;
  children: string;
}

export const SwitchUI = ({ checked, children }: SwitchUiProps) => (
  <>
    <StyledContainer checked={checked} role="presentation">
      <OnIcon />
      <OffIcon fill="white" />
    </StyledContainer>
    <StyledText>{children}</StyledText>
  </>
);

interface SliderProps {
  checked: boolean;
}

const WIDTH = 20;
const PADDING = 2;

const StyledContainer = styled.div<SliderProps>`
  display: flex;
  flex-direction: row;
  position: relative;
  padding: ${PADDING}px;
  width: ${WIDTH * 2 + PADDING * 2}px;
  height: ${WIDTH + PADDING * 2}px;
  border-radius: 4px;
  color: #fff;
  font-size: ${WIDTH}px;
  background-color: ${({ checked }) => (checked ? '#0067C5' : '#4F4F4F')};
  transition: ease-in-out background-color 50ms;
  will-change: background-color;

  ::before {
    content: '';
    position: absolute;
    left: ${PADDING}px;
    height: ${WIDTH}px;
    width: ${WIDTH}px;
    background-color: white;
    border-radius: 4px;
    transform: ${({ checked }) => (checked ? 'translateX(100%)' : 'translateX(0)')};
    transition: ease-in-out transform 50ms;
    will-change: transform;
  }
`;

const StyledText = styled.span`
  padding-left: 8px;
`;

const OffIcon = styled(Close)`
  width: 50%;
  height: 100%;
  color: #fff;
  padding: 2px;
`;

const OnIcon = styled(SuccessStroke)`
  width: 50%;
  height: 100%;
  color: #fff;
  padding: 2px;
`;
