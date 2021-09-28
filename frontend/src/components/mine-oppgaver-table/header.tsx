import React from 'react';
import { StyledTableHeader } from './styled-components';

interface TableHeaderProps {
  headers: (string | null)[];
}

export const TableHeader: React.FC<TableHeaderProps> = ({ headers }) => (
  <thead>
    <tr>
      {headers.map((h, i) =>
        typeof h === 'string' ? <StyledTableHeader key={h}>{h}</StyledTableHeader> : <StyledTableHeader key={i} />
      )}
    </tr>
  </thead>
);
