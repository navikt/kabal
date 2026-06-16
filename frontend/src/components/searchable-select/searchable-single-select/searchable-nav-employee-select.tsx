import { Tag } from '@navikt/ds-react';
import { useMemo } from 'react';
import { SearchableSelect } from '@/components/searchable-select/searchable-single-select/searchable-single-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useKlageenheter } from '@/simple-api-state/use-kodeverk';
import type { INavEmployee, INavEmployeeWithEnhet } from '@/types/bruker';
import type { IKlageenhet } from '@/types/kodeverk';

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

const getAnsattEnhetIdTag = (enheter: IKlageenhet[] | undefined, ansattEnhetId: string) => {
  const enhet = enheter?.find((e) => e.id === ansattEnhetId);
  const enhetNavn = enhet?.navn;
  const enhetLabel = enhetNavn?.split(' ')[1] ?? enhetNavn ?? ansattEnhetId;
  return enhet ? (
    <Tag size="xsmall" variant="outline" data-color="accent" className="overflow-hidden font-mono">
      <span className="truncate">{enhetLabel}</span>
    </Tag>
  ) : null;
};

export const toSaksbehandlerAndMUEntry = (
  employee: INavEmployeeWithEnhet,
  enheter: IKlageenhet[] | undefined,
): Entry<INavEmployeeWithEnhet> => ({
  value: employee,
  key: employee.navIdent,
  plainText: `${employee.navn} ${employee.navIdent} ${employee.ansattEnhetId}`,
  label: (
    <div className="flex max-w-full grow flex-row items-center gap-2 overflow-hidden whitespace-nowrap">
      <span className="truncate">{employee.navn}</span>
      <Tag size="xsmall" variant="strong" data-color="neutral" className="font-mono">
        {employee.navIdent}
      </Tag>
      {getAnsattEnhetIdTag(enheter, employee.ansattEnhetId)}
    </div>
  ),
});

export interface SearchableNavEmployeeSelectProps {
  label: string;
  options: INavEmployeeWithEnhet[];
  value: INavEmployee | null;
  onChange: (employee: INavEmployeeWithEnhet) => void;
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
  const { data: enheter } = useKlageenheter();

  const entries = useMemo(
    () => options.map((option) => toSaksbehandlerAndMUEntry(option, enheter)),
    [options, enheter],
  );

  const selectedEntry = useMemo(
    (): Entry<INavEmployeeWithEnhet> | null =>
      value === null ? null : (entries.find((e) => e.key === value.navIdent) ?? null),
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
