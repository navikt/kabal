import React, { useEffect, useState } from 'react';
import { IKodeverkSimpleValue, IKodeverkValue } from '../../types/kodeverk';
import { Header } from './header';
import { Filter } from './option';
import { StyledDropdown, StyledListItem, StyledSectionList } from './styled-components';

export interface IDropdownOption<T> {
  value: T;
  label: string;
}

interface DropdownProps<T extends string> {
  selected: T[];
  options: IDropdownOption<T>[];
  onChange: (id: T | null, active: boolean) => void;
  open: boolean;
  close: () => void;
}

export const Dropdown = <T extends string>({
  selected,
  options,
  open,
  onChange,
  close,
}: DropdownProps<T>): JSX.Element | null => {
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

  if (!open) {
    return null;
  }

  const reset = () => {
    onChange(null, false);
  };

  const onSelectFocused = () => {
    const focusedOption = options[focused].value;
    onChange(focusedOption, !selected.includes(focusedOption));
  };

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
      <StyledSectionList data-testid="filter-list">
        {filteredOptions.map(({ value, label }, i) => (
          <StyledListItem key={value}>
            <Filter active={selected.includes(value)} filterId={value} onChange={onChange} focused={i === focused}>
              {label}
            </Filter>
          </StyledListItem>
        ))}
      </StyledSectionList>
    </StyledDropdown>
  );
};

export const kodeverkValuesToDropdownOptions = <T extends string = string>(
  kodeverkValues: IKodeverkValue<T>[],
  labelKey: keyof IKodeverkValue<T> = 'beskrivelse'
): IDropdownOption<T>[] => kodeverkValues.map(({ id, [labelKey]: label }) => ({ value: id, label }));

export const kodeverkSimpleValuesToDropdownOptions = <T extends string = string>(
  kodeverkValues: IKodeverkSimpleValue<T>[],
  labelKey: keyof IKodeverkSimpleValue<T> = 'navn'
): IDropdownOption<T>[] => kodeverkValues.map(({ id, [labelKey]: label }) => ({ value: id, label }));
