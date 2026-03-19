import { FinishedFooter } from '@/components/oppgavebehandling-footer/finished-footer';
import { UnfinishedFooter } from '@/components/oppgavebehandling-footer/unfinished-footer';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';

export const Footer = () => {
  const isFullfoert = useIsFullfoert();

  return isFullfoert ? <FinishedFooter /> : <UnfinishedFooter />;
};
