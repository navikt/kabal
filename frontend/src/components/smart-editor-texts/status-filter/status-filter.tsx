import { FilterDropdown } from '@app/components/filter-dropdown/filter-dropdown';
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

interface Filterable {
  published: boolean;
  publishedDateTime: string | null;
}

const isDepublished = ({ published, publishedDateTime }: Filterable) => !published && publishedDateTime !== null;
const isDraft = ({ published, publishedDateTime }: Filterable) => !published && publishedDateTime === null;
const isPublished = ({ published, publishedDateTime }: Filterable) => published && publishedDateTime !== null;

export const filterByStatus = (filteredStatuses: Status[], text: Filterable) => {
  if (filteredStatuses.length === 0) {
    return !isDepublished(text);
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

  const status = searchParams.get('status');

  const statusAray = status === null ? [] : status.split(',').filter(isStatus);

  const setStatus = (status: Status[]) => {
    if (status.length === 0) {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status.join(','));
    }

    setSearchParams(searchParams);
  };

  return [statusAray, setStatus];
};
