import { Select } from '@navikt/ds-react';
import { useMemo } from 'react';
import { pushEvent } from '@app/observability';
import { HistoryEventTypes, IHistoryResponse } from '@app/types/oppgavebehandling/response';

export const ALL = 'ALL';

interface Props {
  counts: Record<HistoryEventTypes, number>;
  totalCount: number;
  filter: keyof IHistoryResponse | typeof ALL;
  setFilter: (filter: keyof IHistoryResponse | typeof ALL) => void;
}

export const Filter = ({ counts, totalCount, filter, setFilter }: Props) => {
  interface Option {
    label: string;
    value: keyof IHistoryResponse;
  }

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
    ],
    [counts],
  );

  return (
    <Select
      label="Filter"
      size="small"
      hideLabel
      onChange={({ target }) => {
        pushEvent('change-history-filter', 'behandling-panel', { value: target.value });

        if (target.value === ALL || isHistoryResponse(target.value)) {
          setFilter(target.value);
        }
      }}
      value={filter}
    >
      <option value={ALL}>Alle hendelser ({totalCount})</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
};

const KEYS: Record<keyof IHistoryResponse, undefined> = {
  feilregistrert: undefined,
  ferdigstilt: undefined,
  fullmektig: undefined,
  klager: undefined,
  medunderskriver: undefined,
  rol: undefined,
  sattPaaVent: undefined,
  tildeling: undefined,
};

const isHistoryResponse = (key: string): key is keyof IHistoryResponse => key in KEYS;
