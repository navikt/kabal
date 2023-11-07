import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { styled } from 'styled-components';

type Icon = typeof ArrowUpIcon | typeof ArrowDownIcon | typeof ArrowsUpDownIcon;

export enum SortKey {
  TITLE = 'title',
  MODIFIED = 'modified',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum QueryKey {
  SORT = 'sort',
  ORDER = 'order',
}

interface Props {
  label: string;
  sortKey: SortKey;
  querySortKey: SortKey;
  querySortOrder: SortOrder;
}

export const SortableHeader = ({ label, sortKey, querySortKey, querySortOrder }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onClick = () => {
    const next = querySortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC;

    searchParams.set(QueryKey.SORT, sortKey);
    searchParams.set(QueryKey.ORDER, next);

    setSearchParams(searchParams);
  };

  const Icon = getIcon(querySortKey === sortKey ? querySortOrder : null);

  return (
    <StyledButton onClick={onClick} variant="tertiary" iconPosition="right" icon={<Icon aria-hidden />} size="small">
      {label}
    </StyledButton>
  );
};

const getIcon = (order: SortOrder | null): Icon => {
  switch (order) {
    case SortOrder.ASC:
      return ArrowUpIcon;
    case SortOrder.DESC:
      return ArrowDownIcon;
    case null:
      return ArrowsUpDownIcon;
  }
};

const StyledButton = styled(Button)`
  justify-content: flex-start;
  padding-left: 0;
  padding-right: 0;
`;
