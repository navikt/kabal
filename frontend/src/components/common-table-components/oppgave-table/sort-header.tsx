import { type SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { ArrowsUpDownIcon, SortDownIcon, SortUpIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';

interface Props {
  sortKey: SortFieldEnum;
  children: React.ReactNode;
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
  onSortChange: (sortKey: string) => void;
}

export const SortHeader = ({ sortKey, children, sortering, rekkefoelge, onSortChange }: Props) => (
  <Table.HeaderCell aria-sort={sortering === sortKey ? SORT_MAP[rekkefoelge] : 'none'}>
    <Button
      variant="tertiary"
      size="medium"
      onClick={() => onSortChange(sortKey)}
      icon={<SortIcon sortKey={sortKey} sortering={sortering} rekkefoelge={rekkefoelge} />}
    >
      {children}
    </Button>
  </Table.HeaderCell>
);

interface SortIconProps {
  sortKey: SortFieldEnum;
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
}

const SortIcon = ({ sortKey, sortering, rekkefoelge }: SortIconProps) => {
  if (sortering !== sortKey) {
    return <ArrowsUpDownIcon aria-hidden role="presentation" />;
  }

  if (rekkefoelge === SortOrderEnum.ASC) {
    return <SortUpIcon aria-hidden role="presentation" />;
  }

  return <SortDownIcon aria-hidden role="presentation" />;
};

const SORT_MAP: Record<SortOrderEnum, 'ascending' | 'descending'> = {
  [SortOrderEnum.ASC]: 'ascending',
  [SortOrderEnum.DESC]: 'descending',
};
