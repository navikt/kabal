import { Box, VStack } from '@navikt/ds-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { FilterList } from './filter-list';
import { Header } from './header';
import type { BaseProps, DropdownProps, IOption } from './props';

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

const WILDCARD_REGEX = /.*/;

export const GroupedFilterList = <T extends string>({
  selected,
  options,
  onChange,
  close,
  testType,
  openDirection = 'down',
  showFjernAlle = true,
}: GroupedDropdownProps<T>): React.JSX.Element | null => {
  const ref = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<RegExp>(WILDCARD_REGEX);
  const [focused, setFocused] = useState(-1);

  const filteredOptions = useMemo(() => {
    const filtered: OptionGroup<T>[] = [];

    for (const option of options) {
      if (option.sectionHeader === undefined) {
        const sectionOptions = option.sectionOptions.filter(({ label }) => filter.test(label));

        if (sectionOptions.length > 0) {
          filtered.push({ ...option, sectionOptions });
        }

        continue;
      }

      const headerMatch = filter.test(option.sectionHeader.name ?? '');

      if (headerMatch) {
        filtered.push(option);
        continue;
      }

      const sectionOptions = option.sectionOptions.filter(({ label }) => filter.test(label));

      if (sectionOptions.length > 0) {
        filtered.push({ ...option, sectionOptions });
      }
    }

    return filtered;
  }, [options, filter]);

  const flattenedFilteredOptions = useMemo(
    () => filteredOptions.flatMap(({ sectionOptions }) => sectionOptions),
    [filteredOptions],
  );

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  }, []);

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

  const isDown = openDirection === 'down';

  return (
    <VStack
      asChild
      overflowY="auto"
      position="absolute"
      width="350px"
      height="400px"
      className={`z-2 scroll-mb-4 ${isDown ? 'top-full left-0' : 'top-0 left-full'}`}
      ref={ref}
    >
      <Box background="bg-default" borderRadius="medium" borderWidth="1" borderColor="border-subtle" shadow="medium">
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
      </Box>
    </VStack>
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

const StyledGroupHeader = styled.h3`
  font-size: var(--a-spacing-4);
  font-weight: 600;
  margin-left: var(--a-spacing-4);
  margin-top: var(--a-spacing-4);
  margin-bottom: var(--a-spacing-2);
`;

const GroupList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  text-overflow: ellipsis;
  flex: 1;
`;
