import { ToggleGroup } from '@navikt/ds-react';

export enum StatusFilter {
  ALL = 'ALL',
  HANDLED = 'HANDLED',
  UNHANDLED = 'UNHANDLED',
}

const STATUS_FILTERS = Object.values(StatusFilter);

export const isStatusFilter = (value: string): value is StatusFilter => STATUS_FILTERS.some((f) => f === value);

export const SetStatusFilter = ({
  filter,
  setFilter,
}: {
  filter: StatusFilter;
  setFilter: (f: StatusFilter) => void;
}) => {
  return (
    <ToggleGroup
      value={filter}
      size="small"
      onChange={(v) => {
        if (isStatusFilter(v)) {
          setFilter(v);
        }
      }}
    >
      <ToggleGroup.Item value={StatusFilter.ALL}>Alle</ToggleGroup.Item>
      <ToggleGroup.Item value={StatusFilter.HANDLED}>Håndterte</ToggleGroup.Item>
      <ToggleGroup.Item value={StatusFilter.UNHANDLED}>Uhåndterte</ToggleGroup.Item>
    </ToggleGroup>
  );
};
