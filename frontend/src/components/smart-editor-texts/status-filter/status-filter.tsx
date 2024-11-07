import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
import {
  type Filterable,
  isDepublished,
  isDraft,
  isPublished,
} from '@app/components/smart-editor-texts/functions/status-helpers';
import { useSearchParams } from 'react-router-dom';

export const StatusFilter = () => {
  const [filteredStatuses, setFilteredStatuses] = useStatusFilter();

  return (
    <FilterDropdown<Status>
      data-testid="filter-status"
      selected={filteredStatuses}
      options={STATUS_OPTIONS}
      onChange={setFilteredStatuses}
    >
      Status
    </FilterDropdown>
  );
};

export enum Status {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DEPUBLISHED = 'depublished',
}

export const STATUS_OPTIONS = [
  { value: Status.PUBLISHED, label: 'Publisert' },
  { value: Status.DRAFT, label: 'Utkast' },
  { value: Status.DEPUBLISHED, label: 'Avpublisert' },
];

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
