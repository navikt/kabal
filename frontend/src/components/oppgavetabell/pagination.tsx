import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  total: number;
  pageSize: number;
  currentPage: number;
}

export const Pagination: React.FC<Props> = ({ total, pageSize = 10, currentPage = 1 }) => {
  const pages = usePagination(total, pageSize, currentPage);
  return (
    <div>
      {pages.map((p) =>
        typeof p === 'string' ? (
          '...'
        ) : (
          <PageLink key={p.toString()} to={p.toString()}>
            {p}
          </PageLink>
        )
      )}
    </div>
  );
};

const PageLink = styled(NavLink)`
  padding: 0.5em;
  color: black;
  text-decoration: none;
  border-radius: 0.2em;

  :hover {
    background: rgba(0, 103, 197, 0.5);
  }

  &.active {
    background: #0067c5;
    color: white;
    cursor: unset;
  }
`;

const PAGES = {
  1: [1],
  2: [1, 2],
  3: [1, 2, 3],
  4: [1, 2, 3, 4],
  5: [1, 2, 3, 4, 5],
};

export const usePagination = (total: number, pageSize = 10, currentPage = 1): (number | string)[] => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 5) {
    return PAGES[totalPages];
  }

  const items: (number | string)[] = [1];

  const max = totalPages - 1;
  const min = 2;
  const start = Math.max(currentPage - 3, min);
  const end = Math.min(currentPage + 3, max);

  if (start !== min) {
    items.push('...');
  }

  for (let i = start; i <= end; i++) {
    items.push(i);
  }

  if (end !== max) {
    items.push('...');
  }

  items.push(totalPages);

  return items;
};
