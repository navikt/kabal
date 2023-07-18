import React from 'react';
import { styled } from 'styled-components';
import { Filter } from './option';
import { BaseProps } from './props';

export const FilterList = <T extends string>({ selected, options, focused, onChange }: BaseProps<T>) => {
  const setSelected = (value: T, active: boolean) => {
    const selectedOptions: T[] = active
      ? [...selected, value]
      : selected.filter((selectedValue: string) => selectedValue !== value);

    onChange(selectedOptions);
  };

  return (
    <StyledFilterList data-testid="filter-list">
      {options.map(({ value, label }) => (
        <StyledListItem key={value} data-testid="filter-list-item" data-filterid={value}>
          <Filter
            active={selected.includes(value)}
            filterId={value}
            onChange={setSelected}
            focused={value === focused?.value}
          >
            {label}
          </Filter>
        </StyledListItem>
      ))}
    </StyledFilterList>
  );
};

const StyledFilterList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
`;

const StyledListItem = styled.li`
  margin: 0;
  padding: 0;
  padding-left: 8px;
  width: 100%;
`;
