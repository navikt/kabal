import React from 'react';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';
import { FinishedFooter } from './finished-footer';
import { UnfinishedFooter } from './unfinished-footer';

export const Footer = () => {
  const isFullfoert = useIsFullfoert();

  return isFullfoert ? <FinishedFooter /> : <UnfinishedFooter />;
};
