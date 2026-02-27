import { usePanelContainerRef } from '@app/components/oppgavebehandling-panels/panel-container-ref-context';
import { SearchableMultiSelect } from '@app/components/searchable-select/searchable-multi-select/searchable-multi-select';
import { pushEvent } from '@app/observability';
import { HistoryEventTypes, type IHistoryResponse } from '@app/types/oppgavebehandling/response';
import { useCallback, useMemo } from 'react';

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
  const options: Option[] = useMemo(
    () => [
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
    ],
    [counts],
  );

  const value = useMemo(() => options.filter((o) => filters.includes(o.value)), [options, filters]);

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
      valueKey={optionValueKey}
      formatOption={formatOption}
      emptyLabel={`Alle hendelser (${totalCount})`}
      filterText={optionFilterText}
      onChange={onChange}
      scrollContainerRef={containerRef}
    />
  );
};

const optionValueKey = (option: Option): string => option.value;
const formatOption = (option: Option) => option.label;
const optionFilterText = (option: Option): string => option.label;
