import React from 'react';

interface TableHeaderProps {
  headers: string[];
}

export const TableHeader = ({ headers }: TableHeaderProps): JSX.Element => (
  <thead>
    <tr>
      {headers.map((h) => (
        <th key={h} role="columnheader">
          {h}
        </th>
      ))}
    </tr>
  </thead>
);
