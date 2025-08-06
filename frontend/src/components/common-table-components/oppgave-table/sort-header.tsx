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

export const SortHeader = ({ sortKey, sortering, rekkefoelge, ...rest }: Props) => (
  <Table.HeaderCell aria-sort={getAriaSort(sortKey, sortering, rekkefoelge)}>
    <SortButton sortKey={sortKey} sortering={sortering} rekkefoelge={rekkefoelge} {...rest} />
  </Table.HeaderCell>
);

export const getAriaSort = (
  sortKey: SortFieldEnum,
  sortering: SortFieldEnum,
  rekkefoelge: SortOrderEnum,
): 'ascending' | 'descending' | 'none' => {
  if (sortering !== sortKey) {
    return 'none';
  }
  return rekkefoelge === SortOrderEnum.ASC ? 'ascending' : 'descending';
};

export interface SortButtonProps extends Props {
  className?: string;
}

export const SortButton = ({ sortKey, children, sortering, rekkefoelge, onSortChange, className }: SortButtonProps) => (
  <Button
    variant="tertiary"
    size="medium"
    onClick={() => onSortChange(sortKey)}
    icon={<SortIcon sortKey={sortKey} sortering={sortering} rekkefoelge={rekkefoelge} />}
    className={className}
  >
    {children}
  </Button>
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
