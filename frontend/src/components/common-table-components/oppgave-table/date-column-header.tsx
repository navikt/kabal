import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, TableProps } from '@navikt/ds-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { styled } from 'styled-components';
import { StyledColumnHeader } from '@app/components/common-table-components/oppgave-table/styled-components';
import { SetCommonOppgaverParams } from '@app/components/common-table-components/oppgave-table/types';
import { ISO_FORMAT } from '@app/components/date-picker/constants';
import { DatePickerRange } from '@app/components/date-picker-range/date-picker-range';
import {
  CommonOppgaverParams,
  FromDateSortKeys,
  SortFieldEnum,
  SortOrderEnum,
  ToDateSortKeys,
} from '@app/types/oppgaver';

interface SortProps {
  params: CommonOppgaverParams;
  onSortChange: TableProps['onSortChange'];
  sortKey: SortFieldEnum;
  children: string;
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
    <StyledSortButton
      variant="tertiary"
      icon={<Icon fontSize={16} />}
      onClick={onClick}
      $sorted={sorted}
      iconPosition="right"
    >
      {children}
    </StyledSortButton>
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
  children: string;
  fromKey: keyof FromDateSortKeys;
  toKey: keyof ToDateSortKeys;
}

export const DateColumnHeader = ({
  params: filters,
  setParams: setFilters,
  onSortChange,
  children,
  fromKey,
  toKey,
}: DateColumnHeaderProps) => (
  <StyledColumnHeader aria-sort={filters.rekkefoelge === SortOrderEnum.STIGENDE ? 'ascending' : 'descending'}>
    <Container>
      <Sort params={filters} onSortChange={onSortChange} sortKey={SortFieldEnum.MOTTATT}>
        {children}
      </Sort>
      <Filter params={filters} setParams={setFilters} fromKey={fromKey} toKey={toKey} />
    </Container>
  </StyledColumnHeader>
);

const getSortIcon = (sorted: boolean, rekkefoelge: SortOrderEnum) => {
  if (sorted) {
    return rekkefoelge === SortOrderEnum.STIGENDE ? ArrowUpIcon : ArrowDownIcon;
  }

  return ArrowsUpDownIcon;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

interface StyledSortButtonProps {
  $sorted: boolean;
}

interface SortButtonProps extends ButtonProps, StyledSortButtonProps {}

const SortButton = (props: SortButtonProps) => <Button {...props} />;

const StyledSortButton = styled(SortButton)<StyledSortButtonProps>`
  background-color: ${({ $sorted }) => ($sorted ? 'var(--a-surface-selected)' : 'transparent')};
  white-space: nowrap;
  border-radius: var(--a-border-radius-small);
  padding: var(--a-spacing-4) var(--a-spacing-3);
`;
