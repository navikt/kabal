import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FilterList } from './filter-list';
import { Header } from './header';
import { BaseProps, DropdownProps, IOption } from './props';

export interface SectionHeader {
  id: string;
  name?: string;
}

export interface OptionGroup<T extends string> {
  sectionHeader: SectionHeader;
  sectionOptions: IOption<T>[];
}

interface GroupedDropdownProps<T extends string> extends BaseProps<T, OptionGroup<T>>, DropdownProps {
  showFjernAlle?: boolean;
  testId?: string;
}

export const GroupedDropdown = <T extends string>({
  selected,
  options,
  open,
  onChange,
  close,
  testId,
  showFjernAlle = true,
}: GroupedDropdownProps<T>): JSX.Element | null => {
  const [filter, setFilter] = useState<RegExp>(/.*/);
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [flattenedFilteredOptions, setFlattenedFilteredOptions] = useState<IOption<T>[]>(
    options.flatMap(({ sectionOptions }) => sectionOptions)
  );

  useEffect(() => {
    const filteredGroups = options.filter(({ sectionOptions }) =>
      sectionOptions.some(({ label }) => filter.test(label))
    );

    const filtered = filteredGroups.map(({ sectionOptions, ...rest }) => ({
      ...rest,
      sectionOptions: sectionOptions.filter(({ label }) => filter.test(label)),
    }));

    setFilteredOptions(filtered);
    setFlattenedFilteredOptions(filtered.flatMap(({ sectionOptions }) => sectionOptions));
  }, [setFilteredOptions, options, filter]);

  useEffect(() => {
    if (!open && focused !== -1) {
      setFocused(-1);
    }
  }, [open, focused]);

  const reset = () => onChange([]);

  const onSelectFocused = () => {
    const focusedOption = flattenedFilteredOptions[focused];

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

  const focusedOption = flattenedFilteredOptions[focused] ?? null;

  return (
    <StyledDropdown>
      <Header
        onFocusChange={setFocused}
        onFilterChange={setFilter}
        onSelect={onSelectFocused}
        focused={focused}
        onReset={reset}
        optionsCount={flattenedFilteredOptions.length}
        close={close}
        showFjernAlle={showFjernAlle}
      />
      <StyledSectionList data-testid={`${testId ?? 'grouped-dropdown'}-list`}>
        {filteredOptions.map(({ sectionHeader, sectionOptions }) => (
          <li key={sectionHeader.id}>
            {typeof sectionHeader.name !== 'undefined' && (
              <StyledSectionHeader>{sectionHeader.name}</StyledSectionHeader>
            )}
            <FilterList options={sectionOptions} selected={selected} onChange={onChange} focused={focusedOption} />
          </li>
        ))}
      </StyledSectionList>
    </StyledDropdown>
  );
};

const StyledDropdown = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  z-index: 1;
  width: 100%;
  min-width: 275px;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
`;

const StyledSectionHeader = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-left: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const StyledSectionList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;
