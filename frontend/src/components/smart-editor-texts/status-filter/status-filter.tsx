import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchableMultiSelect } from '@/components/searchable-select/searchable-multi-select/searchable-multi-select';
import {
  type Filterable,
  isDepublished,
  isDraft,
  isPublished,
} from '@/components/smart-editor-texts/functions/status-helpers';

export const StatusFilter = () => {
  const [filteredStatuses, setFilteredStatuses] = useStatusFilter();

  const selectedOptions = useMemo(
    () => STATUS_OPTIONS.filter((o) => filteredStatuses.includes(o.value)),
    [filteredStatuses],
  );

  const handleChange = useCallback(
    (options: StatusOption[]) => setFilteredStatuses(options.map((o) => o.value)),
    [setFilteredStatuses],
  );

  return (
    <SearchableMultiSelect
      label="Status"
      options={STATUS_OPTIONS}
      value={selectedOptions}
      valueKey={statusValueKey}
      formatOption={statusFormat}
      emptyLabel="Alle statuser"
      filterText={statusFormat}
      onChange={handleChange}
      showSelectAll
    />
  );
};

export enum Status {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DEPUBLISHED = 'depublished',
}

export interface StatusOption {
  value: Status;
  label: string;
}

export const STATUS_OPTIONS: StatusOption[] = [
  { value: Status.PUBLISHED, label: 'Publisert' },
  { value: Status.DRAFT, label: 'Utkast' },
  { value: Status.DEPUBLISHED, label: 'Avpublisert' },
];

const statusValueKey = (option: StatusOption) => option.value;
const statusFormat = (option: StatusOption) => option.label;

const STATUS_VALUES = Object.values(Status);

const isStatus = (value: string): value is Status => STATUS_VALUES.some((status) => status === value);

const PARAM_KEY = 'status';

export const DEFAULT_STATUSES = [Status.PUBLISHED, Status.DRAFT];

export const DEFAULT_STATUS_FILTER = `${PARAM_KEY}=${DEFAULT_STATUSES.join(encodeURIComponent(','))}`;

export const filterByStatus = (filteredStatuses: Status[], text: Filterable) => {
  if (filteredStatuses.length === 0) {
    return true;
  }

  if (filteredStatuses.includes(Status.PUBLISHED) && isPublished(text)) {
    return true;
  }

  if (filteredStatuses.includes(Status.DRAFT) && isDraft(text)) {
    return true;
  }

  if (filteredStatuses.includes(Status.DEPUBLISHED) && isDepublished(text)) {
    return true;
  }
};

export const useStatusFilter = (): [Status[], (s: Status[]) => void] => {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get(PARAM_KEY);

  const statusAray = status === null ? [] : status.split(',').filter(isStatus);

  const setStatus = (status: Status[]) => {
    if (status.length === 0) {
      searchParams.delete(PARAM_KEY);
    } else {
      searchParams.set(PARAM_KEY, status.join(','));
    }

    setSearchParams(searchParams);
  };

  return [statusAray, setStatus];
};
