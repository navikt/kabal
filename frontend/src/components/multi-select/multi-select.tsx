import React, { useRef, useState } from 'react';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import { IKodeverkVerdi } from '../../redux-api/kodeverk';
import { Dropdown } from '../filter-dropdown/dropdown';
import { ToggleButton } from '../toggle-button/toggle-button';
import { StyledMultiSelect, StyledTitle } from './styled-components';

interface MultiSelectProps {
  title: React.ReactNode;
  options: IKodeverkVerdi[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
}

export const MultiSelect = ({ title, onChange, options, selected, disabled }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref, true);

  const setSelected = (id: string | null, active: boolean) => {
    if (id === null) {
      return;
    }

    const newList = active ? [...selected, id] : selected.filter((selectedValue: string) => selectedValue !== id);

    onChange(newList);
  };

  const toggleOpen = () => setOpen(!open);

  return (
    <StyledMultiSelect ref={ref}>
      <ToggleButton onClick={toggleOpen} disabled={disabled} theme={{ open, minHeight: '3rem' }}>
        <StyledTitle>{title}</StyledTitle>
      </ToggleButton>

      <Dropdown selected={selected} options={options} open={open} onChange={setSelected} />
    </StyledMultiSelect>
  );
};
