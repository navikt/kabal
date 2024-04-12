import { Button, Heading } from '@navikt/ds-react';
import React from 'react';

interface Props {
  children: string;
  onResetFilters: undefined | (() => void);
}

export const TableHeading = ({ children, onResetFilters }: Props) => (
  <Heading size="small" style={{ display: 'flex', gap: 16 }}>
    {children}
    {onResetFilters === undefined ? null : (
      <Button size="small" onClick={onResetFilters} variant="secondary">
        Nullstill filtere
      </Button>
    )}
  </Heading>
);
