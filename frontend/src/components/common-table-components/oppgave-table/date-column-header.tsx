import { StyledColumnHeader } from '@app/components/common-table-components/oppgave-table/styled-components';
import type { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import {
  type CommonOppgaverParams,
  type FromDateSortKeys,
  type SortFieldEnum,
  SortOrderEnum,
  type ToDateSortKeys,
} from '@app/types/oppgaver';
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons';
import { Button, HStack, type TableProps } from '@navikt/ds-react';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';

interface SortProps {
  params: CommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
  sortKey: SortFieldEnum;
  children: string | null;
}

interface FilterProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  fromKey: keyof FromDateSortKeys;
  toKey: keyof ToDateSortKeys;
}

const Sort = ({ params, onSortChange, sortKey, children }: SortProps) => {
  const onClick = () => {
    onSortChange?.(sortKey);
  };

  const sorted = params.sortering === sortKey;
  const Icon = getSortIcon(sorted, params.rekkefoelge);

  return (
    <Button
      variant="tertiary"
      icon={<Icon fontSize={16} />}
      onClick={onClick}
      iconPosition="right"
      className={`whitespace-nowrap rounded-md px-3 py-4 ${sorted ? 'bg-(--a-surface-selected)' : 'bg-transparent'}`}
    >
      {children}
    </Button>
  );
};

const Filter = ({ params: filters, setParams: setFilters, fromKey, toKey }: FilterProps) => {
  const onChange = (range: DateRange | undefined) => {
    if (range === undefined) {
      return setFilters({
        ...filters,
        [fromKey]: undefined,
        [toKey]: undefined,
      });
    }

    setFilters({
      ...filters,
      [fromKey]: range.from instanceof Date ? format(range.from, ISO_FORMAT) : undefined,
      [toKey]: range.to instanceof Date ? format(range.to, ISO_FORMAT) : undefined,
    });
  };

  return <DatePickerRange onChange={onChange} selected={{ from: filters[fromKey], to: filters[toKey] }} />;
};

interface DateColumnHeaderProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
  children: string | null;
  fromKey: keyof FromDateSortKeys;
  toKey: keyof ToDateSortKeys;
  sortKey: SortFieldEnum;
}

export const DateColumnHeader = ({
  params,
  setParams,
  onSortChange,
  children,
  fromKey,
  toKey,
  sortKey,
}: DateColumnHeaderProps) => (
  <StyledColumnHeader aria-sort={params.rekkefoelge === SortOrderEnum.STIGENDE ? 'ascending' : 'descending'}>
    <HStack align="center" gap="1" wrap={false}>
      <Sort params={params} onSortChange={onSortChange} sortKey={sortKey}>
        {children}
      </Sort>
      <Filter params={params} setParams={setParams} fromKey={fromKey} toKey={toKey} />
    </HStack>
  </StyledColumnHeader>
);

const getSortIcon = (sorted: boolean, rekkefoelge: SortOrderEnum) => {
  if (sorted) {
    return rekkefoelge === SortOrderEnum.STIGENDE ? ArrowUpIcon : ArrowDownIcon;
  }

  return ArrowsUpDownIcon;
};
