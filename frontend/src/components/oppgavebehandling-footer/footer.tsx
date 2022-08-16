import React from 'react';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { FinishedFooter } from './finished-footer';
import { UnfinishedFooter } from './unfinished-footer';

export const Footer = () => {
  const isFullfoert = useIsFullfoert();

  return isFullfoert ? <FinishedFooter /> : <UnfinishedFooter />;
};
