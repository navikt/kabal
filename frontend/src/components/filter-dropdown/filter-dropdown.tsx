import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { IKodeverkVerdi } from '../../redux-api/kodeverk';
import { ToggleButton } from '../toggle-button/toggle-button';
import { Dropdown } from './dropdown';

interface FilterDropdownProps {
  options: IKodeverkVerdi[];
  selected: string[];
  onChange: (selected: string[]) => void;
  children: string;
  fixedWidth?: boolean;
}

export const FilterDropdown = ({
  options,
  selected,
  onChange,
  children,
  fixedWidth,
}: FilterDropdownProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  const onFilterChange = (id: string | null, active: boolean) => {
    if (id === null) {
      onChange([]);
    } else {
      onChange(active ? [...selected, id] : selected.filter((s) => s !== id));
    }
  };

  useOnClickOutside(() => setOpen(false), ref, true);

  return (
    <Container ref={ref}>
      <ToggleButton theme={{ open }} onClick={() => setOpen(!open)}>
        {children} ({selected.length})
      </ToggleButton>
      <Dropdown selected={selected} options={options} open={open} onChange={onFilterChange} fixedWidth={fixedWidth} />
    </Container>
  );
};

const Container = styled.section`
  position: relative;
`;
