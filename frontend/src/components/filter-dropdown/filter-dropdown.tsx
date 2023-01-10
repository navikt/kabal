import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { ToggleButton } from '../toggle-button/toggle-button';
import { Dropdown } from './dropdown';
import { BaseProps } from './props';

interface FilterDropdownProps<T extends string> extends BaseProps<T> {
  children: string;
  testId?: string;
}

export const FilterDropdown = <T extends string>({
  options,
  selected,
  onChange,
  children,
  testId,
}: FilterDropdownProps<T>): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(() => setOpen(false), ref, true);

  const close = () => {
    buttonRef.current?.focus();
    setOpen(false);
  };

  return (
    <Container ref={ref} data-testid={testId}>
      <ToggleButton $open={open} onClick={() => setOpen(!open)} ref={buttonRef} data-testid="toggle-button">
        {children} ({selected.length})
      </ToggleButton>
      <Popup isOpen={open}>
        <Dropdown selected={selected} options={options} open={open} onChange={onChange} close={close} />
      </Popup>
    </Container>
  );
};

const Container = styled.section`
  position: relative;
`;

interface PopupProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Popup = ({ isOpen, children }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  return <StyledPopup>{children}</StyledPopup>;
};

const StyledPopup = styled.div`
  display: flex;
  position: absolute;
  top: 100%;
  left: 0;
  width: 275px;
  max-height: 256px;
  z-index: 3;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;
