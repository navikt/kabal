import React, { useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { FilterList } from './filter-list';
import { Header } from './header';
import { BaseProps, DropdownProps, IOption } from './props';

interface SectionHeader {
  id: string;
  name?: string;
}

export interface OptionGroup<T extends string> {
  sectionHeader: SectionHeader;
  sectionOptions: IOption<T>[];
}

interface GroupedDropdownProps<T extends string> extends BaseProps<T, OptionGroup<T>>, DropdownProps {
  showFjernAlle?: boolean;
  testType: string;
  openDirection?: Direction;
}

type Direction = 'down' | 'right';

export const GroupedFilterList = <T extends string>({
  selected,
  options,
  open,
  onChange,
  close,
  testType,
  openDirection: direction = 'down',
  showFjernAlle = true,
}: GroupedDropdownProps<T>): JSX.Element | null => {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<RegExp>(/.*/);
  const [focused, setFocused] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [flattenedFilteredOptions, setFlattenedFilteredOptions] = useState<IOption<T>[]>(
    options.flatMap(({ sectionOptions }) => sectionOptions),
  );

  useEffect(() => {
    const filteredGroups = options.filter(({ sectionOptions }) =>
      sectionOptions.some(({ label }) => filter.test(label)),
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

  useEffect(() => {
    if (open) {
      ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
    }
  }, [open]);

  if (!open) {
    return null;
  }

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
    <Container $openDirection={direction} ref={ref}>
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
      <GroupList data-testid="group-filter-list" data-type={testType}>
        {filteredOptions.map(({ sectionHeader, sectionOptions }) => (
          <li
            key={sectionHeader.id}
            data-testid="filter-group"
            data-groupid={sectionHeader.id}
            data-groupname={sectionHeader.name}
          >
            <GroupHeader header={sectionHeader.name} />
            <FilterList options={sectionOptions} selected={selected} onChange={onChange} focused={focusedOption} />
          </li>
        ))}
      </GroupList>
    </Container>
  );
};

interface GroupHeaderProps {
  header?: string | undefined;
}

const GroupHeader = ({ header }: GroupHeaderProps) => {
  if (typeof header !== 'string') {
    return null;
  }

  return <StyledGroupHeader data-testid="group-title">{header}</StyledGroupHeader>;
};

const Container = styled.div<{ $openDirection: Direction }>`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
  overflow-y: auto;

  position: absolute;
  top: ${({ $openDirection }) => ($openDirection === 'down' ? '100%' : '0')};
  left: ${({ $openDirection }) => ($openDirection === 'down' ? '0' : '100%')};
  z-index: 2;
  max-height: 400px;
  scroll-margin-bottom: 16px;
  background-color: white;
  border-radius: 0.25rem;
  border: 1px solid var(--a-border-subtle);
  box-shadow: var(--a-shadow-medium);

  width: 350px;
  height: 400px;
`;

const StyledGroupHeader = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-left: 16px;
  margin-top: 16px;
  margin-bottom: 8px;
`;

const GroupList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;
