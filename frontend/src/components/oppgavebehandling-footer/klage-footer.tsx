import React from 'react';
import { useIsFullfoert } from '../../hooks/use-is-fullfoert';
import { FinishedKlageFooter } from './finished-klage-footer';
import { UnfinishedKlageFooter } from './unfinished-klage-footer';

export const KlageFooter = () => {
  const isFullfoert = useIsFullfoert();

  return isFullfoert ? <FinishedKlageFooter /> : <UnfinishedKlageFooter />;
};
