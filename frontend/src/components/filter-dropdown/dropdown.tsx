import { useEffect, useState } from 'react';
import { styled } from 'styled-components';
import { FilterList } from './filter-list';
import { Header } from './header';
import type { BaseProps, DropdownProps } from './props';

interface Props<T extends string> extends BaseProps<T>, DropdownProps {}

const WILDCARD_REGEX = /.*/;

export const Dropdown = <T extends string>({ selected, options, onChange, close }: Props<T>): JSX.Element | null => {
  const [filter, setFilter] = useState<RegExp>(WILDCARD_REGEX);
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(options.filter(({ label }) => filter.test(label)));
  }, [options, filter]);

  const reset = () => onChange([]);

  const onSelectFocused = () => {
    const focusedOption = filteredOptions[focused];

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
        showFjernAlle
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
  background-color: var(--a-bg-default);
  border-radius: var(--a-border-radius-medium);
  border: 1px solid var(--a-border-divider);
  box-shadow: 0 1px var(--a-spacing-1) 0 rgba(0, 0, 0, 0.3);
  z-index: 1;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
`;
