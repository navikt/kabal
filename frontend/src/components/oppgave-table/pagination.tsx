import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { usePagination } from '../../hooks/pagination/use-pagination';

interface Props {
  total: number;
  pageSize: number;
  currentPage: number;
}

export const Pagination = ({ total, pageSize = 10, currentPage = 1 }: Props): JSX.Element | null => {
  const pages = usePagination(total, pageSize, currentPage);

  if (total === 0) {
    return null;
  }

  return (
    <div>
      {pages.map((p) =>
        typeof p === 'string' ? (
          p
        ) : (
          <PageLink key={p.toString()} to={`../${p.toString()}`}>
            {p}
          </PageLink>
        )
      )}
    </div>
  );
};

const PageLink = styled(NavLink)`
  display: inline-block;
  padding: 0.5em;
  color: black;
  text-decoration: none;
  border-radius: 4px;
  min-width: 3em;
  text-align: center;

  :hover {
    background: rgba(0, 103, 197, 0.5);
  }

  &.active {
    background: #0067c5;
    color: white;
    cursor: unset;
  }
`;
