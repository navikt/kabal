import { FinishedCaseMessages } from '@/components/behandling/behandlingsdialog/messages/finished';
import { UnfinishedCaseMessages } from '@/components/behandling/behandlingsdialog/messages/unfinished';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';

export const Messages = () => {
  const isFullfoert = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  return isFullfoert || isFeilregistrert ? <FinishedCaseMessages /> : <UnfinishedCaseMessages />;
};
