import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { Dropdown, IDropdownOption } from '../dropdown/dropdown';
import { ToggleButton } from '../toggle-button/toggle-button';

interface FilterDropdownProps<T extends string> {
  options: IDropdownOption<T>[];
  selected: T[];
  onChange: (selected: T[]) => void;
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

  const onFilterChange = (id: T | null, active: boolean) => {
    if (id === null) {
      onChange([]);
    } else {
      onChange(active ? [...selected, id] : selected.filter((s) => s !== id));
    }
  };

  useOnClickOutside(() => setOpen(false), ref, true);

  const close = () => {
    buttonRef.current?.focus();
    setOpen(false);
  };

  return (
    <Container ref={ref} data-testid={testId}>
      <ToggleButton theme={{ open }} onClick={() => setOpen(!open)} ref={buttonRef} data-testid="toggle-button">
        {children} ({selected.length})
      </ToggleButton>
      <Dropdown selected={selected} options={options} open={open} onChange={onFilterChange} close={close} />
    </Container>
  );
};

const Container = styled.section`
  position: relative;
`;
