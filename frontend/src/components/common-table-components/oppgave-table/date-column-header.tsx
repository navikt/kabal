import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import { type SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@navikt/aksel-icons';
import { Button, HStack, Table, type TableProps } from '@navikt/ds-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

interface SortProps {
  sortering: SortFieldEnum;
  rekkefoelge: SortOrderEnum;
  sortKey: SortFieldEnum;
  onSortChange: Exclude<TableProps['onSortChange'], undefined>;
  children: string | null;
}

interface FilterProps {
  from: string | undefined;
  to: string | undefined;
  setFrom: (value: string | undefined) => void;
  setTo: (value: string | undefined) => void;
}

const Sort = ({ sortering, rekkefoelge, onSortChange, sortKey, children }: SortProps) => {
  const sorted = sortering === sortKey;
  const Icon = getSortIcon(sorted, rekkefoelge);

  return (
    <Button
      variant="tertiary"
      icon={<Icon fontSize={16} />}
      onClick={() => onSortChange(sortKey)}
      iconPosition="right"
      className={`whitespace-nowrap rounded-md px-3 py-4 ${sorted ? 'bg-surface-selected' : 'bg-transparent'}`}
    >
      {children}
    </Button>
  );
};

const Filter = ({ from, to, setFrom, setTo }: FilterProps) => {
  const onChange = (range: DateRange | undefined) => {
    if (range === undefined) {
      setFrom(undefined);
      setTo(undefined);
      return;
    }

    setFrom(range.from instanceof Date ? format(range.from, ISO_FORMAT) : undefined);
    setTo(range.to instanceof Date ? format(range.to, ISO_FORMAT) : undefined);
  };

  return <DatePickerRange onChange={onChange} selected={{ from, to }} />;
};

interface DateColumnHeaderProps extends FilterProps, SortProps {
  interactive?: boolean;
}

export const DateColumnHeader = ({
  from,
  to,
  setFrom,
  setTo,
  rekkefoelge,
  sortering,
  children,
  sortKey,
  onSortChange,
  interactive = true,
}: DateColumnHeaderProps) => (
  <Table.ColumnHeader
    className="whitespace-nowrap"
    aria-sort={rekkefoelge === SortOrderEnum.ASC ? 'ascending' : 'descending'}
  >
    <HStack align="center" gap="1" wrap={false}>
      {interactive ? (
        <>
          <Sort sortering={sortering} rekkefoelge={rekkefoelge} onSortChange={onSortChange} sortKey={sortKey}>
            {children}
          </Sort>
          <Filter from={from} to={to} setFrom={setFrom} setTo={setTo} />
        </>
      ) : (
        children
      )}
    </HStack>
  </Table.ColumnHeader>
);

const getSortIcon = (sorted: boolean, rekkefoelge: SortOrderEnum) => {
  if (sorted) {
    return rekkefoelge === SortOrderEnum.ASC ? ArrowUpIcon : ArrowDownIcon;
  }

  return ArrowsUpDownIcon;
};
