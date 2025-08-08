import { SortOrderEnum } from '@app/types/oppgaver';
import { ArrowsUpDownIcon, SortDownIcon, SortUpIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, Table } from '@navikt/ds-react';

interface Props {
  sortKey: string;
  children: React.ReactNode;
  sortering: string;
  rekkefoelge: SortOrderEnum;
  onSortChange: (sortKey: string) => void;
}

export const SortHeader = ({ sortKey, sortering, rekkefoelge, ...rest }: Props) => (
  <Table.HeaderCell aria-sort={getAriaSort(sortKey, sortering, rekkefoelge)}>
    <SortButton sortKey={sortKey} sortering={sortering} rekkefoelge={rekkefoelge} {...rest} />
  </Table.HeaderCell>
);

export const getAriaSort = (
  sortKey: string,
  sortering: string,
  rekkefoelge: SortOrderEnum,
): 'ascending' | 'descending' | 'none' => {
  if (sortering !== sortKey) {
    return 'none';
  }
  return rekkefoelge === SortOrderEnum.ASC ? 'ascending' : 'descending';
};

export interface SortButtonProps extends Props {
  className?: string;
  size?: ButtonProps['size'];
}

export const SortButton = ({
  sortKey,
  children,
  sortering,
  rekkefoelge,
  onSortChange,
  className,
  size,
}: SortButtonProps) => (
  <Button
    variant={sortering === sortKey ? 'primary-neutral' : 'tertiary-neutral'}
    size={size}
    onClick={() => onSortChange(sortKey)}
    icon={<SortIcon sortKey={sortKey} sortering={sortering} rekkefoelge={rekkefoelge} />}
    className={className}
    iconPosition="right"
  >
    {children}
  </Button>
);

interface SortIconProps {
  sortKey: string;
  sortering: string;
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
