import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FilterList } from './filter-list';
import { Header } from './header';
import { BaseProps, DropdownProps } from './props';

interface Props<T extends string> extends BaseProps<T>, DropdownProps {}

export const Dropdown = <T extends string>({
  selected,
  options,
  open,
  onChange,
  close,
}: Props<T>): JSX.Element | null => {
  const [filter, setFilter] = useState<RegExp>(/.*/);
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(options.filter(({ label }) => filter.test(label)));
  }, [setFilteredOptions, options, filter]);

  useEffect(() => {
    if (!open && focused !== -1) {
      setFocused(-1);
    }
  }, [open, focused]);

  const reset = () => onChange([]);

  const onSelectFocused = () => {
    const focusedOption = options[focused];

    if (focusedOption === undefined) {
      return;
    }

    const { value } = focusedOption;
    const isSelected = selected.includes(value);

    if (isSelected) {
      onChange(selected.filter((s) => s !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const focusedOption = filteredOptions[focused] ?? null;

  return (
    <StyledDropdown data-testid="filter-dropdown">
      <Header
        onFocusChange={setFocused}
        onFilterChange={setFilter}
        onSelect={onSelectFocused}
        focused={focused}
        onReset={reset}
        optionsCount={options.length}
        close={close}
        showFjernAlle={true}
      />
      <FilterList options={filteredOptions} selected={selected} onChange={onChange} focused={focusedOption} />
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #c6c2bf;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.3);
  z-index: 1;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
`;
