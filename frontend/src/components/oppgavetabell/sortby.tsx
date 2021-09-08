import React from 'react';
import styled from 'styled-components';

interface SortByProps {
  desc: boolean;
  onChange: (desc: boolean) => void;
}

export const SortBy: React.FC<SortByProps> = ({ desc, onChange }) => (
  <th aria-sort={getAriaSort(desc)} role="columnheader">
    <ToggleSortButton desc={desc} aria-label="Sorter Etternavn stigende" onClick={() => onChange(!desc)}>
      Frist
    </ToggleSortButton>
  </th>
);

const getAriaSort = (desc: boolean) => (desc ? 'descending' : 'ascending');

interface ToggleSortButtonProps {
  desc: boolean;
}

const ToggleSortButton = styled.button<ToggleSortButtonProps>`
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

  ::before {
    transform: ${({ desc }) =>
      desc ? 'translateX(-3px) translateY(-50%) rotate(45deg)' : 'translateX(-3px) translateY(-50%) rotate(-45deg)'};
  }

  ::after {
    transform: ${({ desc }) =>
      desc ? 'translateX(1.5px) translateY(-50%) rotate(-45deg)' : 'translateX(1.5px) translateY(-50%) rotate(45deg)'};
  }
`;
