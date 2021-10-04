import { NedChevron } from 'nav-frontend-chevron';
import { Checkbox } from 'nav-frontend-skjema';
import React, { useRef, useState } from 'react';
import { useOnClickOutside } from '../../hooks/use-on-click-outside';
import {
  StyledButton,
  StyledExpandedChild,
  StyledExpandedChildren,
  StyledMultiSelect,
  StyledTitle,
} from './styled-components';

interface MultiSelectItem {
  label: string;
  value: string;
}

interface MultiSelectProps {
  title: React.ReactNode;
  options: MultiSelectItem[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export const MultiSelect = ({ title, onChange, options, selected }: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(() => setOpen(false), ref, true);

  const setSelected = (id: string, checked: boolean) => {
    const newList = checked ? [...selected, id] : selected.filter((selectedValue: string) => selectedValue !== id);

    onChange(newList);
  };

  const expandedChildren = options.map(({ label, value }) => (
    <StyledExpandedChild key={value}>
      <Checkbox
        label={label}
        checked={selected.includes(value)}
        onChange={(event) => setSelected(value, event.target.checked)}
      />
    </StyledExpandedChild>
  ));

  const toggleOpen = () => setOpen(!open);

  return (
    <StyledMultiSelect ref={ref}>
      <StyledButton onClick={toggleOpen}>
        <StyledTitle>{title}</StyledTitle>
        <NedChevron />
      </StyledButton>

      {open && <StyledExpandedChildren>{expandedChildren}</StyledExpandedChildren>}
    </StyledMultiSelect>
  );
};
