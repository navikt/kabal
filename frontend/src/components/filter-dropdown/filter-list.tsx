import { CheckboxGroup } from '@navikt/ds-react';
import React from 'react';
import { Filter } from './option';
import { BaseProps } from './props';

interface Props<T extends string> extends BaseProps<T> {
  className?: string;
  error?: string | null;
}

export const FilterList = <T extends string>({ selected, options, focused, onChange, className, error }: Props<T>) => (
  <CheckboxGroup
    legend="Velg hjemler"
    hideLegend
    data-testid="filter-list"
    onChange={onChange}
    value={selected}
    className={className}
    error={error}
  >
    {options.map(({ value, label, disabled, tags }) => (
      <Filter
        key={value}
        data-testid="filter-list-item"
        data-filterid={value}
        filterId={value}
        focused={value === focused?.value}
        tags={tags}
        disabled={disabled}
      >
        {label}
      </Filter>
    ))}
  </CheckboxGroup>
);
