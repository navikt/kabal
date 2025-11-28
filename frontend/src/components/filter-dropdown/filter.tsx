import { ChevronDownIcon } from '@navikt/aksel-icons';
import { ActionMenu, Button, Checkbox, CheckboxGroup, HStack, TextField } from '@navikt/ds-react';
import { useMemo, useState } from 'react';

export interface FilterType<T extends string | number = string> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  children: string | null;
  options: FilterType<T>[];
  selected: T[];
  onChange: (filters: T[]) => void;
  style?: React.CSSProperties;
  className?: string;
  'data-testid'?: string;
  showCounter?: boolean;
}

export const Filter = <T extends string | number>({
  selected,
  onChange,
  options,
  children,
  style,
  className,
  'data-testid': testId,
  showCounter = true,
}: Props<T>) => {
  const [value, setValue] = useState('');

  const selectedOptions = useMemo(
    () => (selected || []).map((id) => options.find((option) => option.value === id)).filter((v) => v !== undefined),
    [options, selected],
  );

  const filteredOptions = useMemo(
    () => options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())),
    [options, value],
  );

  const all = useMemo(() => options.map((option) => option.value), [options]);

  return (
    <div style={style} className={className} data-testid={testId}>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            size="small"
            variant="secondary-neutral"
            icon={<ChevronDownIcon aria-hidden />}
            iconPosition="right"
            className="justify-between!"
          >
            {children} {showCounter ? `(${selectedOptions.length})` : null}
          </Button>
        </ActionMenu.Trigger>

        <ActionMenu.Content className="relative">
          <HStack wrap={false} className="sticky top-0 z-1 bg-ax-bg-default">
            <TextField
              size="small"
              autoFocus
              className="grow"
              placeholder="Filtrer"
              label={children}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              hideLabel
            />

            <Button onClick={() => onChange(all)} size="small" variant="secondary" style={{ marginLeft: 8 }}>
              Velg alle
            </Button>

            <Button onClick={() => onChange([])} size="small" variant="danger" style={{ marginLeft: 8 }}>
              Fjern alle
            </Button>
          </HStack>

          <ActionMenu.Divider />

          <CheckboxGroup legend={children} hideLegend value={selected} onChange={onChange}>
            {filteredOptions.map(({ value: id, label }) => (
              // <Checkbox> renders much faster than <ActionMenu.CheckboxItem>
              <Checkbox key={id} size="small" value={id.toString()}>
                {label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  );
};
