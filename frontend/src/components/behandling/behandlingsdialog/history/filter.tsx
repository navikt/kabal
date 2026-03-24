import { useCallback, useMemo } from 'react';
import { usePanelContainerRef } from '@/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import type { Entry } from '@/components/searchable-select/virtualized-option-list';
import { pushEvent } from '@/observability';
import { HistoryEventTypes, type IHistoryResponse } from '@/types/oppgavebehandling/response';

interface Option {
  label: string;
  value: keyof IHistoryResponse;
}

interface Props {
  counts: Record<HistoryEventTypes, number>;
  totalCount: number;
  filters: (keyof IHistoryResponse)[];
  setFilters: (filters: (keyof IHistoryResponse)[]) => void;
}

export const Filter = ({ counts, totalCount, filters, setFilters }: Props) => {
  const containerRef = usePanelContainerRef();

  const options: Entry<Option>[] = useMemo(
    () =>
      (
        [
          { label: `Feilregistrert (${counts[HistoryEventTypes.FEILREGISTRERT]})`, value: 'feilregistrert' },
          { label: `Ferdigstilt (${counts[HistoryEventTypes.FERDIGSTILT]})`, value: 'ferdigstilt' },
          { label: `Fullmektig (${counts[HistoryEventTypes.FULLMEKTIG]})`, value: 'fullmektig' },
          { label: `Klager (${counts[HistoryEventTypes.KLAGER]})`, value: 'klager' },
          { label: `Medunderskriver (${counts[HistoryEventTypes.MEDUNDERSKRIVER]})`, value: 'medunderskriver' },
          { label: `Rådgivende overlege (${counts[HistoryEventTypes.ROL]})`, value: 'rol' },
          { label: `Satt på vent (${counts[HistoryEventTypes.SATT_PAA_VENT]})`, value: 'sattPaaVent' },
          { label: `Tildeling (${counts[HistoryEventTypes.TILDELING]})`, value: 'tildeling' },
          {
            label: `Varslet behandlingstid (${counts[HistoryEventTypes.VARSLET_BEHANDLINGSTID]})`,
            value: 'varsletBehandlingstid',
          },
          {
            label: `Forlenget behandlingstid (${counts[HistoryEventTypes.FORLENGET_BEHANDLINGSTID]})`,
            value: 'forlengetBehandlingstid',
          },
        ] satisfies Option[]
      ).map(
        (o): Entry<Option> => ({
          key: o.value,
          label: o.label,
          plainText: o.label,
          value: o,
        }),
      ),
    [counts],
  );

  const value = useMemo(() => options.filter((entry) => filters.includes(entry.value.value)), [options, filters]);

  const onChange = useCallback(
    (selected: Option[]) => {
      const values = selected.map((o) => o.value);
      pushEvent('change-history-filter', 'behandling-panel', { value: values.join(',') });
      setFilters(values);
    },
    [setFilters],
  );

  return (
    <SearchableMultiSelect
      label="Filter"
      options={options}
      value={value}
      emptyLabel={`Alle hendelser (${totalCount})`}
      onChange={onChange}
      scrollContainerRef={containerRef}
      showSelectAll
    />
  );
};
