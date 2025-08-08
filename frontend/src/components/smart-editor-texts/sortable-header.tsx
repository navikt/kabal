import { SortOrder } from '@app/types/sort';
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { useSearchParams } from 'react-router-dom';

type Icon = typeof ArrowUpIcon | typeof ArrowDownIcon | typeof ArrowsUpDownIcon;

export enum SortKey {
  TITLE = 'title',
  MODIFIED = 'modified',
  SCORE = 'score',
}

export enum QueryKey {
  SORT = 'sort',
  ORDER = 'order',
}

interface Props {
  label: React.ReactNode;
  sortKey: SortKey;
  querySortKey: SortKey;
  querySortOrder: SortOrder;
  title?: string;
}

export const SortableHeader = ({ label, sortKey, querySortKey, querySortOrder, title }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onClick = () => {
    const next = querySortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;

    searchParams.set(QueryKey.SORT, sortKey);
    searchParams.set(QueryKey.ORDER, next);

    setSearchParams(searchParams);
  };

  const active = querySortKey === sortKey;
  const Icon = getIcon(active ? querySortOrder : null);

  if (title === undefined) {
    return (
      <Button
        onClick={onClick}
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        iconPosition="right"
        icon={<Icon aria-hidden />}
        size="small"
        className="justify-start"
      >
        {label}
      </Button>
    );
  }

  return (
    <Tooltip content={title}>
      <Button
        onClick={onClick}
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        iconPosition="right"
        icon={<Icon aria-hidden />}
        size="small"
        className="justify-start"
      >
        {label}
      </Button>
    </Tooltip>
  );
};

const getIcon = (order: SortOrder | null): Icon => {
  switch (order) {
    case SortOrder.ASC:
      return ArrowUpIcon;
    case SortOrder.DESC:
      return ArrowDownIcon;
    case null:
      return ArrowsUpDownIcon;
  }
};
