import {
  getAriaSort,
  SortButton,
  type SortButtonProps,
} from '@app/components/common-table-components/oppgave-table/sort-header';
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import { BoxNew, HStack, Table } from '@navikt/ds-react';
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

  return <DatePickerRange onChange={onChange} selected={{ from, to }} buttonClassName="rounded-l-none" />;
};

interface DateColumnHeaderProps extends FilterProps, SortButtonProps {
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
  <Table.ColumnHeader className="whitespace-nowrap p-0" aria-sort={getAriaSort(sortKey, sortering, rekkefoelge)}>
    <BoxNew
      asChild
      borderRadius="large"
      width="fit-content"
      className="-outline-offset-2 hover:outline-2 hover:outline-ax-bg-accent-moderate-hover"
    >
      <HStack align="stretch" gap="1" wrap={false}>
        {interactive ? (
          <>
            <SortButton
              sortering={sortering}
              rekkefoelge={rekkefoelge}
              onSortChange={onSortChange}
              sortKey={sortKey}
              className="rounded-r-none"
            >
              {children}
            </SortButton>

            <Filter {...filterProps} />
          </>
        ) : (
          children
        )}
      </HStack>
    </BoxNew>
  </Table.ColumnHeader>
);
