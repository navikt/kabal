import React from 'react';

interface TableHeaderProps {
  headers: (string | null)[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => (
  <thead>
    <tr>
      {headers.map((h, i) =>
        typeof h === 'string' ? (
          <th key={h} role="columnheader">
            {h}
          </th>
        ) : (
          <th key={i} />
        )
      )}
    </tr>
  </thead>
);
