import { Tag } from '@navikt/ds-react';
import { useMemo } from 'react';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import type { INavEmployee } from '@/types/bruker';

export const toNavEmployeeEntry = (employee: INavEmployee): Entry<INavEmployee> => ({
  value: employee,
  key: employee.navIdent,
  plainText: `${employee.navn} ${employee.navIdent}`,
  label: (
    <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
      <span>{employee.navn}</span>

      <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
        {employee.navIdent}
      </Tag>
    </div>
  ),
});

export interface SearchableNavEmployeeSelectProps {
  label: string;
  options: INavEmployee[];
  value: INavEmployee | null;
  onChange: (employee: INavEmployee) => void;
  /** Text shown on the trigger button when no value is selected. */
  nullLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  confirmLabel: string;
  /** Whether the popover should flip its placement when it reaches the viewport edge. */
  flip?: boolean;
}

export const SearchableNavEmployeeSelect = ({
  label,
  options,
  value,
  onChange,
  nullLabel,
  disabled,
  loading,
  confirmLabel,
  flip,
}: SearchableNavEmployeeSelectProps) => {
  const entries = useMemo(() => options.map(toNavEmployeeEntry), [options]);

  const selectedEntry = useMemo(
    (): Entry<INavEmployee> | null => (value === null ? null : (entries.find((e) => e.key === value.navIdent) ?? null)),
    [value, entries],
  );

  return (
    <SearchableSelect
      label={label}
      options={entries}
      value={selectedEntry}
      onChange={onChange}
      nullLabel={nullLabel}
      disabled={disabled}
      loading={loading}
      confirmLabel={confirmLabel}
      flip={flip}
      requireConfirmation
    />
  );
};
