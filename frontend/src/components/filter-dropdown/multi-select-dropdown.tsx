import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, type ButtonProps, Checkbox, CheckboxGroup, HStack, TextField } from '@navikt/ds-react';
import { type ReactNode, useMemo, useState } from 'react';

export interface FilterType<T extends string | number = string> {
  value: T;
  label: string;
}

interface CommonProps<T extends string | number> {
  options: FilterType<T>[];
  selected: T[];
  onChange: (filters: T[]) => void;
  style?: React.CSSProperties;
  className?: string;
  'data-testid'?: string;
  showCounter?: boolean;
  variant?: ButtonProps['variant'];
}

interface MultiSelectDropdownFlatProps<T extends string | number> extends CommonProps<T> {
  children: string | null;
}

export const FlatMultiSelectDropdown = <T extends string | number>(props: MultiSelectDropdownFlatProps<T>) => {
  const { selected, onChange, options, children } = props;

  const [search, setSearch] = useState('');

  const allOptions = useMemo(() => options.map((option) => option.value), [options]);

  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase())),
    [options, search],
  );

  return (
    <MultiSelectDropdown {...props} label={children ?? ''} value={search} setValue={setSearch} allOptions={allOptions}>
      <CheckboxGroup legend={children} hideLegend value={selected} onChange={onChange}>
        {filteredOptions.map(({ value: id, label }) => (
          // <Checkbox> renders much faster than <ActionMenu.CheckboxItem>
          <Checkbox key={id} size="small" value={id}>
            {label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </MultiSelectDropdown>
  );
};

interface MultiSelectDropdownProps<T extends string | number> extends CommonProps<T> {
  children: ReactNode;
  label: string;
  value: string;
  setValue: (value: string) => void;
  allOptions: T[];
}

export const MultiSelectDropdown = <T extends string | number>({
  selected,
  onChange,
  options: _options,
  children,
  style,
  className,
  label,
  value,
  setValue,
  allOptions,
  variant = 'tertiary-neutral',
  'data-testid': testId,
  showCounter = true,
}: MultiSelectDropdownProps<T>) => {
  const selectedCount = useMemo(
    () => (selected || []).filter((id) => allOptions.includes(id)).length,
    [allOptions, selected],
  );

  return (
    <div style={style} className={className} data-testid={testId}>
      <ActionMenu>
        <Trigger variant={variant}>
          {label}
          {showCounter ? ` (${selectedCount})` : null}
        </Trigger>

        <ActionMenu.Content className="relative max-h-[90vh]">
          <Header<T> label={label} value={value} setValue={setValue} onChange={onChange} allOptions={allOptions} />

          <ActionMenu.Divider />

          {children}
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  );
};

export const Trigger = ({ children, variant }: { children: ReactNode; variant: ButtonProps['variant'] }) => (
  <ActionMenu.Trigger>
    <Button
      size="small"
      variant={variant}
      icon={<ChevronDownIcon aria-hidden />}
      iconPosition="right"
      className="justify-between! whitespace-nowrap"
    >
      {children}
    </Button>
  </ActionMenu.Trigger>
);

interface HeaderProps<T extends string | number> {
  label: string;
  value: string;
  setValue: (value: string) => void;
  onChange: (filters: T[]) => void;
  allOptions: T[];
}

export const Header = <T extends string | number>({
  label,
  value,
  setValue,
  onChange,
  allOptions: all,
}: HeaderProps<T>) => (
  <HStack wrap={false} className="sticky top-0 z-1 gap-2 bg-ax-bg-default">
    <TextField
      size="small"
      autoFocus
      className="grow"
      placeholder="Filtrer"
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      hideLabel
    />

    <Button onClick={() => onChange(all)} size="small" variant="secondary">
      Velg alle
    </Button>

    <Button data-color="danger" onClick={() => onChange([])} size="small" variant="primary">
      Fjern alle
    </Button>
  </HStack>
);
