import React, { useEffect, useState } from 'react';
import { Header } from './header';
import { Filter } from './option';
import {
  StyledDropdown,
  StyledDropdownProps,
  StyledListItem,
  StyledOptionList,
  StyledSectionHeader,
  StyledSectionList,
} from './styled-components';

export interface Option {
  label: string;
  value: string;
}

export interface SectionHeader {
  id: string;
  name?: string;
}

export interface OptionGroup {
  sectionHeader: SectionHeader;
  sectionOptions: Option[];
}

interface DropdownProps extends StyledDropdownProps {
  selected: string[];
  options: OptionGroup[];
  onChange: (id: string | null, active: boolean) => void;
  open: boolean;
  close: () => void;
  showFjernAlle?: boolean;
  testId?: string;
}

export const GroupedDropdown = ({
  selected,
  options,
  open,
  onChange,
  close,
  top,
  left,
  maxHeight,
  testId,
  showFjernAlle = true,
}: DropdownProps): JSX.Element | null => {
  const [filter, setFilter] = useState<RegExp>(/.*/g);
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [flattenedFilteredOptions, setFlattenedFilteredOptions] = useState<Option[]>(
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

  if (!open) {
    return null;
  }

  const reset = () => {
    onChange(null, false);
  };

  const onSelectFocused = () => {
    const focusedOption = flattenedFilteredOptions[focused].value;
    onChange(focusedOption, !selected.includes(focusedOption));
  };

  return (
    <StyledDropdown top={top} left={left} maxHeight={maxHeight}>
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
            <StyledOptionList data-testid={`${sectionHeader.name ?? 'grouped-dropdown'}-option-list`}>
              {sectionOptions.map(({ value, label }) => (
                <StyledListItem key={value}>
                  <Filter
                    active={selected.includes(value)}
                    filterId={value}
                    onChange={onChange}
                    focused={focused === flattenedFilteredOptions.findIndex((o) => o.value === value)}
                  >
                    {label}
                  </Filter>
                </StyledListItem>
              ))}
            </StyledOptionList>
          </li>
        ))}
      </StyledSectionList>
    </StyledDropdown>
  );
};
