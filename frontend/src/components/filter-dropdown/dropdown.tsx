import { BoxNew, VStack } from '@navikt/ds-react';
import { useEffect, useState } from 'react';
import { FilterList } from './filter-list';
import { Header } from './header';
import type { BaseProps, DropdownProps } from './props';

interface Props<T extends string> extends BaseProps<T>, DropdownProps {}

const WILDCARD_REGEX = /.*/;

export const Dropdown = <T extends string>({
  selected,
  options,
  onChange,
  close,
}: Props<T>): React.JSX.Element | null => {
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
    <VStack asChild overflowY="auto" maxHeight="inherit" maxWidth="100%" data-testid="filter-dropdown">
      <BoxNew background="default" borderRadius="medium" borderWidth="1" borderColor="neutral" shadow="dialog">
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
      </BoxNew>
    </VStack>
  );
};
