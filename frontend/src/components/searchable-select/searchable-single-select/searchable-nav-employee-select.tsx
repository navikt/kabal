import { Tag } from '@navikt/ds-react';
import { useCallback } from 'react';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { INavEmployee } from '@/types/bruker';

export interface SearchableNavEmployeeSelectProps {
  label: string;
  options: INavEmployee[];
  value: INavEmployee | null;
  onChange: (employee: INavEmployee) => void;
  onClear?: () => void;
  nullLabel?: string;
  disabled?: boolean;
  confirmLabel: string;
  /** Whether the popover should flip its placement when it reaches the viewport edge. */
  flip?: boolean;
}

export const SearchableNavEmployeeSelect = ({
  label,
  options,
  value,
  onChange,
  onClear,
  nullLabel = 'Ingen valgt',
  disabled,
  confirmLabel,
  flip,
}: SearchableNavEmployeeSelectProps) => {
  const formatLabel = useCallback(
    (option: INavEmployee | null): React.ReactNode =>
      option === null ? (
        nullLabel
      ) : (
        <div className="flex grow flex-row items-center justify-between gap-2 whitespace-nowrap">
          <span>{option.navn}</span>

          <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
            {option.navIdent}
          </Tag>
        </div>
      ),
    [nullLabel],
  );

  return (
    <SearchableSelect
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      onClear={onClear}
      disabled={disabled}
      valueKey={employeeValueKey}
      formatLabel={formatLabel}
      filterOption={employeeFilterOption}
      confirmLabel={confirmLabel}
      flip={flip}
    />
  );
};

const employeeValueKey = (option: INavEmployee): string => option.navIdent;

const employeeFilterOption = (option: INavEmployee, search: string): boolean => {
  const target = `${option.navn} ${option.navIdent}`.toLowerCase();

  return fuzzyMatch(target, search.toLowerCase());
};

/** Returns true if all characters of `query` appear in `target` in order. */
const fuzzyMatch = (target: string, query: string): boolean => {
  let ti = 0;

  for (const ch of query) {
    const idx = target.indexOf(ch, ti);

    if (idx === -1) {
      return false;
    }

    ti = idx + 1;
  }

  return true;
};
