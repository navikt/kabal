import { FinishedFooter } from '@app/components/oppgavebehandling-footer/finished-footer';
import { UnfinishedFooter } from '@app/components/oppgavebehandling-footer/unfinished-footer';
import { useIsFullfoert } from '@app/hooks/use-is-fullfoert';

export const Footer = () => {
  const isFullfoert = useIsFullfoert();

  return isFullfoert ? <FinishedFooter /> : <UnfinishedFooter />;
};
