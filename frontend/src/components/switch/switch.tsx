import React from 'react';
import styled from 'styled-components';
import { CancelIcon } from '../../icons/cancelblack';
import { HakeIcon } from '../../icons/hake';

interface SwitchProps {
  onChange: (checked: boolean) => void;
  checked: boolean;
  children: string;
}

export const Switch = ({ checked, onChange, children }: SwitchProps): JSX.Element => (
  <StyledLabel>
    <StyledInput type="checkbox" checked={checked} onChange={({ target }) => onChange(target.checked)} />
    <SwitchUI checked={checked}>{children}</SwitchUI>
  </StyledLabel>
);

const StyledLabel = styled.label`
  display: flex;
  cursor: pointer;
  padding-left: 4px;
  padding-right: 4px;
  user-select: none;
`;

const StyledInput = styled.input`
  display: none;
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

const StyledContainer = styled.div<SliderProps>`
  display: inline-block;
  position: relative;
  padding: 2px;
  width: 48px;
  height: 24px;
  border-radius: 4px;
  background-color: ${({ checked }) => (checked ? '#0067C5' : '#4F4F4F')};

  ::before {
    content: '';
    position: absolute;
    left: 4px;
    height: 20px;
    width: 20px;
    background-color: white;
    border-radius: 4px;
    transform: ${({ checked }) => (checked ? 'translateX(100%)' : 'translateX(0)')};
    transition: ease-in-out transform 100ms;
    will-change: transform;
  }
`;

const StyledText = styled.span`
  padding-left: 0.5em;
`;

const OffIcon = styled(CancelIcon)`
  width: 50%;
  height: 100%;
  padding: 4px;
`;

const OnIcon = styled(HakeIcon)`
  width: 50%;
  height: 100%;
  padding: 4px;
`;
