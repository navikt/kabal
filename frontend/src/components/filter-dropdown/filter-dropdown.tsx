import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { IKodeverkVerdi } from '../../tilstand/moduler/kodeverk';
import { Dropdown } from './dropdown';

interface FilterDropdownProps {
  options: IKodeverkVerdi[];
  selected: string[];
  onChange: (selected: string[]) => void;
  children: string;
}

export const FilterDropdown = ({ options, selected, onChange, children }: FilterDropdownProps): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  const allIds = useMemo(() => options.map(({ id }) => id), [options]);

  const onFilterChange = (id: string | null, active: boolean) => {
    if (id === null) {
      onChange(active ? allIds : []);
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
      <Dropdown selected={selected} options={options} open={open} onChange={onFilterChange} />
    </Container>
  );
};

const Container = styled.section`
  position: relative;
`;

interface ToggleButtonTheme {
  open: boolean;
}

const ToggleButton = styled.button`
  border: 1px solid #78706a;
  padding: 0 1.75rem 0 0.5rem;
  height: 2rem;
  width: 13em;
  border-radius: 0.25rem;
  transition: box-shadow 0.1s ease;
  cursor: pointer;
  background: none;
  user-select: none;
  position: relative;
  font-size: 14px;
  font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
  font-weight: 600;
  color: #3e3832;

  ::before,
  ::after {
    content: '';
    position: absolute;
    width: 0.5rem;
    border-radius: 2px;
    height: 2px;
    background: #59514b;
    right: 0.5rem;
    top: 50%;
    transition: transform 0.1s ease;
  }

  ::before {
    transform: ${({ theme }: { theme: ToggleButtonTheme }) =>
      theme.open
        ? 'translateX(-3px) translateY(-50%) rotate(-45deg)'
        : 'translateX(-3px) translateY(-50%) rotate(45deg)'};
  }

  ::after {
    transform: ${({ theme }: { theme: ToggleButtonTheme }) =>
      theme.open
        ? 'translateX(1.5px) translateY(-50%) rotate(45deg)'
        : 'translateX(1.5px) translateY(-50%) rotate(-45deg)'};
  }

  &:active,
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #254b6d;
  }
`;
