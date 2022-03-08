import React, { useMemo } from 'react';
import styled from 'styled-components';
import { SortFieldEnum, SortOrderEnum } from '../../types/oppgaver';

enum Sort {
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
  NONE = 'none',
}

interface SortByProps {
  sortField: SortFieldEnum;
  defaultSortOrder?: SortOrderEnum;
  sorting: [SortFieldEnum, SortOrderEnum];
  onChange: (sorting: [SortFieldEnum, SortOrderEnum]) => void;
  children: string;
}

export const SortBy = ({
  sorting,
  sortField,
  defaultSortOrder = SortOrderEnum.STIGENDE,
  children,
  onChange,
}: SortByProps): JSX.Element => {
  const [field] = sorting;

  const sort = useMemo(() => getSort(sorting, sortField), [sorting, sortField]);
  const SortButton = useMemo(() => getSortButton(sort), [sort]);

  return (
    <th aria-sort={sort} role="columnheader">
      <SortButton
        aria-label="Sorter"
        onClick={() => {
          if (field !== sortField || sort === Sort.NONE) {
            return onChange([sortField, defaultSortOrder]);
          }

          if (sort === Sort.ASCENDING) {
            return onChange([sortField, SortOrderEnum.SYNKENDE]);
          }

          if (sort === Sort.DESCENDING) {
            return onChange([sortField, SortOrderEnum.STIGENDE]);
          }

          return onChange([sortField, defaultSortOrder]);
        }}
      >
        {children}
      </SortButton>
    </th>
  );
};

const getSort = ([field, order]: [SortFieldEnum, SortOrderEnum], sortField: SortFieldEnum): Sort => {
  if (field !== sortField) {
    return Sort.NONE;
  }

  switch (order) {
    case SortOrderEnum.STIGENDE:
      return Sort.ASCENDING;
    case SortOrderEnum.SYNKENDE:
      return Sort.DESCENDING;
    default:
      return Sort.NONE;
  }
};

const getSortButton = (sort: Sort) => {
  switch (sort) {
    case Sort.ASCENDING:
      return AscSortButton;
    case Sort.DESCENDING:
      return DescSortButton;
    default:
      return NoSortButton;
  }
};

const NoSortButton = styled.button`
  border: none;
  padding: 0 1.75rem 0 0.5rem;
  height: 2rem;
  transition: box-shadow 0.1s ease;
  cursor: pointer;
  background: none;
  user-select: none;
  position: relative;
  font-size: 14px;
  font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
  font-weight: 600;
  color: #3e3832;

  ::before,
  ::after {
    content: '';
    position: absolute;
    width: 0.5rem;
    border-radius: 2px;
    height: 2px;
    background: #59514b;
    right: 0.5rem;
    top: 50%;
    transition: transform 0.1s ease;
  }
`;

const AscSortButton = styled(NoSortButton)`
  ::before {
    transform: translateX(-3px) translateY(-50%) rotate(-45deg);
  }

  ::after {
    transform: translateX(1.5px) translateY(-50%) rotate(45deg);
  }
`;

const DescSortButton = styled(NoSortButton)`
  ::before {
    transform: translateX(-3px) translateY(-50%) rotate(45deg);
  }

  ::after {
    transform: translateX(1.5px) translateY(-50%) rotate(-45deg);
  }
`;
