import { Table } from '@navikt/ds-react';
import { useCallback, useMemo } from 'react';
import type { FilterDropdownProps } from '@/components/common-table-components/oppgave-table/filter-dropdowns/types';
import { useOppgaveTableTyper } from '@/components/common-table-components/oppgave-table/state/use-state';
import { TABLE_HEADERS } from '@/components/common-table-components/types';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { useSakstyper } from '@/simple-api-state/use-kodeverk';
import { ANKETEAM_SAKSTYPER, SaksTypeEnum } from '@/types/kodeverk';

interface SaksTypeOption {
  value: SaksTypeEnum;
  label: string;
}

export const SakstypeForLedigeNonAnkeOppgaver = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    values={[SaksTypeEnum.KLAGE, SaksTypeEnum.ANKE, SaksTypeEnum.OMGJØRINGSKRAV, SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK]}
  />
);

export const SakstypeForSakerITR = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    values={[
      SaksTypeEnum.ANKE_I_TRYGDERETTEN,
      SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
      SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027,
    ]}
  />
);

export const SakstypeForAnkeAfter2027 = (props: FilterDropdownProps) => (
  <Filter {...props} values={ANKETEAM_SAKSTYPER} />
);

export const AllSakstyper = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    values={[
      SaksTypeEnum.KLAGE,
      SaksTypeEnum.ANKE,
      SaksTypeEnum.ANKE_AFTER_2027,
      SaksTypeEnum.OMGJØRINGSKRAV,
      SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK,
      SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027,
      SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR,
      SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_I_TR_AFTER_2027,
      SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET,
      SaksTypeEnum.ANKE_I_TRYGDERETTEN,
      SaksTypeEnum.ANKE_I_TRYGDERETTEN_AFTER_2027,
    ]}
  />
);

export const SakstyperForNonAnketeam = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    values={[SaksTypeEnum.KLAGE, SaksTypeEnum.OMGJØRINGSKRAV, SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET]}
  />
);

export const SakstyperForLedigeAnketeamOppgaver = (props: FilterDropdownProps) => (
  <Filter
    {...props}
    values={[
      SaksTypeEnum.ANKE,
      SaksTypeEnum.ANKE_AFTER_2027,
      SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK,
      SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK_AFTER_2027,
    ]}
  />
);

const Filter = ({ columnKey, tableKey, values }: FilterDropdownProps & { values: SaksTypeEnum[] }) => {
  const [typer, setTyper] = useOppgaveTableTyper(tableKey);
  const { data: sakstyper = [] } = useSakstyper();

  const options: Entry<SaksTypeOption>[] = useMemo(
    () =>
      values
        .map((o) => {
          const label = sakstyper.find((s) => s.id === o)?.navn ?? o;

          return { value: { value: o, label }, key: o, label, plainText: label };
        })
        .toSorted((a, b) => a.label.localeCompare(b.label)),
    [values, sakstyper],
  );

  const selected = useMemo(() => {
    const selectedSet = new Set(typer ?? []);

    return options.filter((entry) => selectedSet.has(entry.value.value));
  }, [typer, options]);

  const onChange = useCallback(
    (values: SaksTypeOption[]) => {
      setTyper(values.length === 0 ? undefined : values.map((v) => v.value));
    },
    [setTyper],
  );

  return (
    <Table.ColumnHeader aria-sort="none">
      <SearchableMultiSelect
        label={TABLE_HEADERS[columnKey] ?? ''}
        options={options}
        value={selected}
        emptyLabel={TABLE_HEADERS[columnKey] ?? ''}
        onChange={onChange}
        triggerVariant="tertiary"
        triggerSize="medium"
        triggerDisplay="count"
        showSelectAll
      />
    </Table.ColumnHeader>
  );
};
