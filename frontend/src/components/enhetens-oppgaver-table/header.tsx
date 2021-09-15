import React from 'react';

interface TableHeaderProps {
  headers: string[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => (
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
