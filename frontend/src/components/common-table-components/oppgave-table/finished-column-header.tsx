import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, Table, TableProps } from '@navikt/ds-react';
import { format } from 'date-fns';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { styled } from 'styled-components';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ISO_DATE_FORMAT } from '@app/components/date-picker/constants';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import { CommonOppgaverParams, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

interface SortProps {
  params: CommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
}

interface FilterProps {
  params: CommonOppgaverParams;
  setParams: SetCommonOppgaverParams;
}

const Sort = ({ params, onSortChange }: SortProps) => {
  const onClick = () => {
    onSortChange?.(SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER);
  };

  const Icon = getSortIcon(params.sortering, params.rekkefoelge);

  const sorted = params.sortering === SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER;

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

const Filter = ({ params: filters, setParams: setFilters }: FilterProps) => {
  const onChange = (range: DateRange | undefined) => {
    if (range === undefined) {
      return setFilters({
        ...filters,
        ferdigstiltFrom: undefined,
        ferdigstiltTo: undefined,
      });
    }

    setFilters({
      ...filters,
      ferdigstiltFrom: range.from instanceof Date ? format(range.from, ISO_DATE_FORMAT) : undefined,
      ferdigstiltTo: range.to instanceof Date ? format(range.to, ISO_DATE_FORMAT) : undefined,
    });
  };

  return (
    <DatePickerRange onChange={onChange} selected={{ from: filters.ferdigstiltFrom, to: filters.ferdigstiltTo }} />
  );
};

export const FinishedColumnHeader = ({
  params: filters,
  setParams: setFilters,
  onSortChange,
}: SortProps & FilterProps) => (
  <Table.ColumnHeader aria-sort={filters.rekkefoelge === SortOrderEnum.STIGENDE ? 'ascending' : 'descending'}>
    <Container>
      Fullført
      <Sort params={filters} onSortChange={onSortChange} />
      <Filter params={filters} setParams={setFilters} />
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
