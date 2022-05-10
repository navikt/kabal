import { Button } from '@navikt/ds-react';
import React from 'react';
import { StatusIcon } from './status-icon';

interface Props {
  isLoading: boolean;
  isSuccess: boolean;
  isUninitialized: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export const AdminButton = ({ children, isLoading, isSuccess, isUninitialized, onClick }: Props): JSX.Element => (
  <Button type="button" variant="primary" size="medium" onClick={onClick} loading={isLoading} disabled={isLoading}>
    {children}
    <StatusIcon success={isSuccess} init={!isUninitialized} isLoading={isLoading} />
  </Button>
);
