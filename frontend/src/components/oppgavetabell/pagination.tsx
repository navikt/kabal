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
    <SCPagination>
      {pages.map((p) => (typeof p === 'string' ? '...' : <NavLink to={p.toString()}>{p}</NavLink>))}
    </SCPagination>
  );
};

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

const SCPagination = styled.div`
  display: block;

  &:not(a) {
    padding: 0.2em;
    border-radius: 0.2em;
    cursor: default !important;
    margin: 0.25em 0 0 0.25em;
  }

  &:not(a).active {
    color: white;
    background-color: #0067c5;
    border: 1px solid #0067c5;
    cursor: default !important;
  }

  a {
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.2em;
    color: black;
    margin: 0.25em 0 0 0.25em;
    text-decoration: none;
  }

  // &:not(.inactive):hover {
  //   color: blue;
  //   cursor: pointer;
  //   transform: scale(1.05);
  //   transition: transform 0.2s ease;
  // }

  // &:not(a).active:hover {
  //   transform: scale(1);
  //   color: white;
  // }
`;

const Dots = styled.span`
  background-color: transparent;
  border: 1px solid transparent;
  color: black;
  margin: 0;
  cursor: default !important;

  &:hover {
    transform: scale(1);
    color: black;
  }
`;
