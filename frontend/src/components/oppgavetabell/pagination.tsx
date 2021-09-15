import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { usePagination } from '../../hooks/pagination/use-pagination';

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
