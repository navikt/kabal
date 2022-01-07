import React from 'react';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { FinishedKlageFooter } from './finished-klage-footer';
import { UnfinishedFooter } from './unfinished-footer';

export const KlageFooter = () => {
  const isFullfoert = useIsFullfoert();

  return isFullfoert ? <FinishedKlageFooter /> : <UnfinishedFooter />;
};
