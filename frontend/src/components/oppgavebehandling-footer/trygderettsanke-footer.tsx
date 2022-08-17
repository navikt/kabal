import React from 'react';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { FinishedAnkeFooter } from './finished-anke-footer';
import { UnfinishedFooter } from './unfinished-footer';

export const TrygderettsankeFooter = () => {
  const isFullfoert = useIsFullfoert();

  return isFullfoert ? <FinishedAnkeFooter /> : <UnfinishedFooter />;
};
