import React from 'react';

interface TableHeaderProps {
  headers: (string | null)[];
}

export const TableHeader = ({ headers }: TableHeaderProps): JSX.Element => (
  <thead>
    <tr>{headers.map((h, i) => (typeof h === 'string' ? <th key={h}>{h}</th> : <th key={i} />))}</tr>
  </thead>
);
