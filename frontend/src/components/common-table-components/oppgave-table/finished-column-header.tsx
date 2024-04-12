import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, Table, TableProps } from '@navikt/ds-react';
import { format } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { styled } from 'styled-components';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

interface SortProps {
  params: CommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
  sortKey: SortFieldEnum;
}

interface FilterProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
  fromKey: keyof Pick<CommonOppgaverParams, 'ferdigstiltFrom' | 'returnertFrom'>;
  toKey: keyof Pick<CommonOppgaverParams, 'ferdigstiltTo' | 'returnertTo'>;
  from: string;
  to: string;
}

const Sort = ({ params, onSortChange, sortKey }: SortProps) => {
  const onClick = () => {
    onSortChange?.(sortKey);
  };

  const Icon = getSortIcon(params.sortering, params.rekkefoelge);

  const sorted = params.sortering === sortKey;

  return (
    <StyledSortButton
      size="small"
      variant="tertiary"
      icon={<Icon fontSize={16} />}
      onClick={onClick}
      $sorted={sorted}
    />
  );
};

const Filter = ({ params: filters, setParams: setFilters, fromKey, toKey, from, to }: FilterProps) => {
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

  return (
    <DatePickerRange
      onChange={onChange}
      selected={{ from: filters[fromKey], to: filters[toKey] }}
      fromDate={from}
      toDate={to}
    />
  );
};

interface FinishedColumnHeaderProps extends ColumnHeaderProps {
  ferdigstiltFrom: string;
  ferdigstiltTo: string;
}

export const FinishedColumnHeader = ({
  params: filters,
  setParams: setFilters,
  onSortChange,
  ferdigstiltFrom,
  ferdigstiltTo,
}: FinishedColumnHeaderProps) => (
  <Table.ColumnHeader aria-sort={filters.rekkefoelge === SortOrderEnum.STIGENDE ? 'ascending' : 'descending'}>
    <Container>
      Fullført
      <Sort params={filters} onSortChange={onSortChange} sortKey={SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER} />
      <Filter
        params={filters}
        setParams={setFilters}
        fromKey="ferdigstiltFrom"
        toKey="ferdigstiltTo"
        from={ferdigstiltFrom}
        to={ferdigstiltTo}
      />
    </Container>
  </Table.ColumnHeader>
);

interface ColumnHeaderProps
  extends Pick<SortProps, 'params' | 'onSortChange'>,
    Pick<FilterProps, 'params' | 'setParams'> {}

interface ReturnedColumnHeaderProps extends ColumnHeaderProps {
  returnertFrom: string;
  returnertTo: string;
}

export const ReturnedColumnHeader = ({
  params: filters,
  setParams: setFilters,
  onSortChange,
  returnertFrom,
  returnertTo,
}: ReturnedColumnHeaderProps) => (
  <Table.ColumnHeader aria-sort={filters.rekkefoelge === SortOrderEnum.STIGENDE ? 'ascending' : 'descending'}>
    <Container>
      Returnert
      <Sort params={filters} onSortChange={onSortChange} sortKey={SortFieldEnum.RETURNERT_FRA_ROL} />
      <Filter
        params={filters}
        setParams={setFilters}
        fromKey="returnertFrom"
        toKey="returnertTo"
        from={returnertFrom}
        to={returnertTo}
      />
    </Container>
  </Table.ColumnHeader>
);

const getSortIcon = (sortering: SortFieldEnum, rekkefoelge: SortOrderEnum) => {
  if (sortering === SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER) {
    return rekkefoelge === SortOrderEnum.STIGENDE ? ArrowUpIcon : ArrowDownIcon;
  }

  return ArrowsUpDownIcon;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: var(--a-spacing-4) var(--a-spacing-3);
`;

interface StyledSortButtonProps {
  $sorted: boolean;
}

interface SortButtonProps extends ButtonProps, StyledSortButtonProps {}

const SortButton = (props: SortButtonProps) => <Button {...props} />;

const StyledSortButton = styled(SortButton)<StyledSortButtonProps>`
  background-color: ${({ $sorted }) => ($sorted ? 'var(--a-surface-selected)' : 'transparent')};
`;
