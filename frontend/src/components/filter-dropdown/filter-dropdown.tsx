import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { IKodeverkVerdi } from '../../redux-api/kodeverk';
import { Dropdown } from '../dropdown/dropdown';
import { ToggleButton } from '../toggle-button/toggle-button';

interface FilterDropdownProps {
  options: IKodeverkVerdi[];
  selected: string[];
  onChange: (selected: string[]) => void;
  children: string;
}

export const FilterDropdown = ({ options, selected, onChange, children }: FilterDropdownProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const onFilterChange = (id: string | null, active: boolean) => {
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
    <Container ref={ref}>
      <ToggleButton theme={{ open }} onClick={() => setOpen(!open)} ref={buttonRef}>
        {children} ({selected.length})
      </ToggleButton>
      <Dropdown selected={selected} options={options} open={open} onChange={onFilterChange} close={close} />
    </Container>
  );
};

const Container = styled.section`
  position: relative;
`;
