import React, { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { ToggleButton } from '../toggle-button/toggle-button';
import { Dropdown } from './dropdown';
import { BaseProps } from './props';

interface FilterDropdownProps<T extends string> extends BaseProps<T> {
  children: string | null;
  'data-testid': string;
  direction?: PopupProps['direction'];
}

export const FilterDropdown = <T extends string>({
  options,
  selected,
  onChange,
  children,
  'data-testid': testId,
  direction,
}: FilterDropdownProps<T>): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useOnClickOutside(ref, () => setOpen(false), true);

  const close = () => {
    buttonRef.current?.focus();
    setOpen(false);
  };

  return (
    <Container ref={ref} data-testid={testId}>
      <ToggleButton $open={open} onClick={() => setOpen(!open)} ref={buttonRef} data-testid="toggle-button">
        {children} ({selected.length})
      </ToggleButton>
      <Popup isOpen={open} direction={direction}>
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
  direction: StyledPopupProps['$direction'];
  children: React.ReactNode;
}

const Popup = ({ isOpen, direction, children }: PopupProps) => {
  if (!isOpen) {
    return null;
  }

  return <StyledPopup $direction={direction}>{children}</StyledPopup>;
};

interface StyledPopupProps {
  $direction?: 'left' | 'right';
}

const StyledPopup = styled.div<StyledPopupProps>`
  display: flex;
  position: absolute;
  top: 100%;
  left: ${({ $direction }) => ($direction === 'left' ? 'auto' : '0')};
  right: ${({ $direction }) => ($direction === 'left' ? '0' : 'auto')};
  width: 275px;
  max-height: 500px;
  z-index: 22;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
`;
