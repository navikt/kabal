import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import { type SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { ArrowsUpDownIcon, SortDownIcon, SortUpIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, HStack, Table, type TableProps } from '@navikt/ds-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

interface FilterProps {
  from: string | undefined;
  to: string | undefined;
  setDateRange: (from: string | undefined, to: string | undefined) => void;
}

const Filter = ({ from, to, setDateRange }: FilterProps) => {
  const onChange = (range: DateRange | undefined) => {
    if (range === undefined) {
      setDateRange(undefined, undefined);
      return;
    }

    setDateRange(
      range.from instanceof Date ? format(range.from, ISO_FORMAT) : undefined,
      range.to instanceof Date ? format(range.to, ISO_FORMAT) : undefined,
    );
  };

  return <DatePickerRange onChange={onChange} selected={{ from, to }} />;
};

interface DateColumnHeaderProps extends FilterProps, SortProps {
  interactive?: boolean;
}

export const DateColumnHeader = ({
  rekkefoelge,
  sortering,
  children,
  sortKey,
  onSortChange,
  interactive = true,
  ...filterProps
}: DateColumnHeaderProps) => (
  <Table.ColumnHeader
    className="whitespace-nowrap p-0"
    aria-sort={sortering === sortKey ? SORT_MAP[rekkefoelge] : 'none'}
  >
    <BoxNew
      asChild
      borderRadius="large"
      className="-outline-offset-2 hover:outline-2 hover:outline-ax-bg-accent-moderate-hover"
    >
      <HStack align="center" gap="1" wrap={false}>
        {interactive ? (
          <>
            <Sort sortering={sortering} rekkefoelge={rekkefoelge} onSortChange={onSortChange} sortKey={sortKey}>
              {children}
            </Sort>
            <Filter {...filterProps} />
          </>
        ) : (
          children
        )}
      </HStack>
    </BoxNew>
  </Table.ColumnHeader>
);

interface SortProps {
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
  sortKey: SortFieldEnum;
  onSortChange: Exclude<TableProps['onSortChange'], undefined>;
  children: string | null;
}

const Sort = ({ sortering, rekkefoelge, onSortChange, sortKey, children }: SortProps) => (
  <Button
    variant="tertiary"
    size="medium"
    icon={<SortIcon sortKey={sortKey} sortering={sortering} rekkefoelge={rekkefoelge} />}
    onClick={() => onSortChange(sortKey)}
    iconPosition="right"
    className="whitespace-nowrap"
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

const SORT_MAP: Record<SortOrderEnum, 'ascending' | 'descending'> = {
  [SortOrderEnum.ASC]: 'ascending',
  [SortOrderEnum.DESC]: 'descending',
};
